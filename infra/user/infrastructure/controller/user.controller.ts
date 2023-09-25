import { NextFunction, Request,Response } from "express"
/* import User, {IUser} from '../models/user' */
import jwt, { SignOptions }  from 'jsonwebtoken'
import config from '../config/config'
import publickKeyObject from '../config/clave'
/* import {registerUser,getDetailUser} from '../services/user.service'
 */import { UserUseCase } from "../../application/userUseCase"
import { IUser } from "../model/user"
import fs from 'fs';
const privateKey = fs.readFileSync('jwtRS256.key');
/* const JWT_SECRET = fs.readFileSync('../config/clave', 'utf8'); */

interface TokenData {
    token: string;
    expiresIn:string;
}

const signOptions: SignOptions = {
    expiresIn: "10s",
    algorithm: "RS256" 
  };
function createToken(user: any){ 
        const signedToken = jwt.sign({"UserInfo": {
          "email": user.email,
          "roles": user.roles
      }},privateKey,signOptions)
        /*  const obj:TokenData = { 
            expiresIn:"10m",
            token:signedToken
        } */
        return signedToken;
}
function refreshToken(user: IUser){ 
        const refreshToken = jwt.sign({name:user.name, email: user.email},privateKey,{
          expiresIn: "1d",
          algorithm: "RS256" 
        })
       /*   const obj:TokenData = { 
            expiresIn:"1d",
            token:refreshToken 
        } */
        return refreshToken;
}

export class UserController{
    constructor(private userUseCase:UserUseCase){

    }

    public getUser = async (req:Request,res:Response)=>{
        const {email} = req.body;
        /* console.log(req.query) */
        const user = await this.userUseCase.getDetaiEmail(`${email}`);
        if(!user){
            return res.status(400).json({msg:'el usuario no existe'})
        }
        res.send({user})
    }

    //registrarse
    public signUp = async (req:Request,res:Response)=>{
        console.log(req.body)
        if(!req.body.email || !req.body.password){
            return res.status(400).json({msg:'Porfavor envia tu email y contraseña'})
        }
        const user = await this.userUseCase.getDetaiEmail(req.body.email);
        if(user){
            return res.status(400).json({msg: 'El usuario existe'})
        }
            
        return await this.userUseCase.registerUsers(req.body).then(result=>{
            return res.status(201).json(result);         
         }).catch(err=>{
             return res.sendStatus(400).send({
                message:err.message|| "some error occured"
            });
         })
         
    }
    //login
    public signIn = async (req: Request,res: Response) => {
        const cookies = req.cookies;
        /* console.log(`cookie available at login: ${JSON.stringify(cookies)}`); */
        if(!req.body.email || !req.body.password){
            return res.status(400).json({msg:'Porfavor envia tu email y contraseña'})
        }
       
        const user = await this.userUseCase.getDetaiEmail(req.body.email)

        if(!user){
            return res.status(400).json({msg:'el usuario no existe',status:false})
        }
        const password = req.body.password
        const isMatch = await user.comparePasswords(password)

        const newUser = {
            uuid:user.uuid,
            name:user.name,
            email:user.email
        }
        //si existen tokens elimina y solo dejamos uno
        if(user.tokens.length>0){
          user.tokens.splice(0, user.tokens.length);
          await user.save();
        }
       
        if(!isMatch){
            return res.status(400).json({msg:'el correo o contraseña son incorrectas', status:false})
        }
        const roles = Object.values(user.roles).filter(Boolean);
        const tokenObject = createToken(user);
        const newRefreshToken = refreshToken(user);
        let newRefreshTokenArray =
        !cookies.jwt ? user.refreshToken : user.refreshToken.filter((rt:any) => rt !== cookies.jwt);

        if (cookies?.jwt) {

              const refreshToken = cookies.jwt;
              const foundToken = await this.userUseCase.searchUser({ refreshToken:refreshToken});

              if (!foundToken) {
                  console.log('attempted refresh token reuse at login!')
                  newRefreshTokenArray = [];
              }
              user.refreshToken = user.refreshToken.filter((rt:any) => rt !== refreshToken);;
              await user.save();
              res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
        }
        let oldTokens = user.tokens || [];
           if (oldTokens.length) {
             oldTokens = oldTokens.filter((tim: any) => {
               const timeDiff = (Date.now() - parseInt(tim.signedAt)) / 1000;

               if (timeDiff < 85300) {
                 return tim;
               }
             });
           } 
       /*  await this.userUseCase.updateToken(true,user._id,oldTokens,tokenObject); */
        
        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await user.save();
       /*  console.log(result); */

        res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'lax',secure: false, maxAge: 24 * 60 * 60 * 1000  })
        res.status(200).json({token:tokenObject,status:true,user:newUser,roles})
    } 

    public prueba = async (req:Request, res:Response) => {
      const cookies = req.cookies;
      console.log(cookies)

      res.status(200).json({status:true})
    }

    public handleRefreshToken = async (req:Request, res:Response) => {
        const cookies = req.cookies;
        console.log(cookies)
        if (!cookies?.jwt) {
          return res.status(401).send({
            message: 'unauthenticated'
          });
        }
        const refreshToken = cookies.jwt;
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        const foundUser = await this.userUseCase.searchUser({refreshToken:refreshToken});
       
        //verificamos el refreshtoken
        if (!foundUser) {
          jwt.verify(
              refreshToken,
              privateKey,
              async (err:any, decoded:any) => {
                  if (err) return res.sendStatus(403); 
                  console.log('attempted refresh token reuse!')
                  const hackedUser = await this.userUseCase.searchUser({ name: decoded.username });
                  hackedUser.refreshToken = [];
                  const result = await hackedUser.save();
                 
              }
            )
          return res.sendStatus(403).send({
            message: 'unauthenticated'
          });
        }

        const newRefreshTokenArray = foundUser.refreshToken.filter((rt:any) => rt !== refreshToken);
        jwt.verify(
          refreshToken,
          privateKey,
          async (err:any, decoded:any) => {
              if (err) {
                  console.log('expired refresh token')
                  foundUser.refreshToken = [...newRefreshTokenArray];
                  const result = await foundUser.save();
                
              }
              if (err || foundUser.email !== decoded.email){
                return res.sendStatus(403);
              } 
              
              //CREAMOS EL TOKEN
              const roles = Object.values(foundUser.roles);
              const accessToken = jwt.sign(
                  {
                      "UserInfo": {
                          "email": decoded.email,
                          "roles": roles
                      }
                  },
                  privateKey,
                  { expiresIn: '10s', algorithm: "RS256" }
              );
  
              //CREAMOS EL REFRESH
              const newRefreshToken = jwt.sign(
                  { "name":foundUser.name,"email": foundUser.email },
                  privateKey,
                  { expiresIn: '1d', algorithm: "RS256" }
              );
              foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
              const result = await foundUser.save();
                
              //GUARDAMOS EN LAS COOKIES EL REFRESH Y EN LA BBDD
              res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });
              console.log(newRefreshToken)
              //devolvemos token
              res.json({ token:accessToken,status:true,roles})
          }
      );

    }

    public isAuth = async (req:Request, res:Response, next:NextFunction) => {
        if (req.headers && req.headers.authorization) {
          const token = req.headers.authorization.split(' ')[1];
          const refreshToken = req.cookies.jwt;
          let user:any;
          //VERIFICAMOS TOKEN Y REFRESH
          if (!token && !refreshToken) {
            return res.status(401).send('Access Denied. No token provided.');
          }

          try {
            //VERIFICAMOS EL TOKEN Y USUARIO, PASAMOS AL SIGUIENTE FUNCION
            const decode:any = jwt.verify(token, privateKey);
         
             user = await this.userUseCase.getDetaiEmail(decode.UserInfo.email);
          
            if (!user) {
              return res.status(401).send({message: 'unauthenticated expired'});
            }
            req.user = user;
            next();
            
          } catch (error:any) {
            
            //VERIFICAMOS EL REFRESH TOKEN
            if (!refreshToken) {
              return res.status(401).send('Access Denied. No refresh token provided.');
            }
        /*     try {
            //CREAMOS VERIFY Y SING ENVIAMOS EL USUARIO
            const roles = Object.values(user.roles).filter(Boolean);
            const decoded:any = jwt.verify(refreshToken, privateKey);
            const accessToken = jwt.sign({ "UserInfo": { "name": decoded.name, "roles": roles }}, privateKey, { expiresIn: "10m", algorithm: "RS256" });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: false })
            .header('Authorization', accessToken)
            .send(decoded);
            console.log(decoded)
            } catch (error) {
              return res.status(400).send('Invalid Token.');
            }
        */
            //VERIFICAMOS ERRORS DE TOKEN
            if (error.name === 'JsonWebTokenError') {
              return res.json({ success: false, message: 'unauthorized access!' });
            }
            if (error.name === 'TokenExpiredError') {
              return res.json({
                success: false,
                message: 'sesson expired try sign in!',
              });
            } 

          }   
        } else {
          res.json({ success: false, message: 'unauthorized access!' });
        }
    }
    //
    public signOut = async (req:Request, res:Response) => {
       /*  if (req.headers && req.headers.authorization) { */
          //verificamos cookies
          const cookies = req.cookies;
          if (!cookies?.jwt){
            return res.sendStatus(204);
          }
          const refreshToken = cookies.jwt;
          

          //verificamos el refresh token
          const foundUser = await this.userUseCase.searchUser({ refreshToken:refreshToken });
          if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
            return res.sendStatus(204);
          }
        
          //verificamos el token
          /* const token = req.headers.authorization.split(' ')[1];        
          const {tokens,_id}:any = req.user;
          if (!token) {
            return res
              .status(401)
              .json({ success: false, message: 'Authorization fail!' });
          }
           console.log(token) */
          //borramos el token
      /*     const newTokens = tokens.filter((t:any) =>t.tokenObject!==token); 
          await this.userUseCase.updateToken(false,_id,newTokens); */
          //borramos el refresh
          foundUser.refreshToken = foundUser.refreshToken.filter((rt:any) => rt !== refreshToken);;
          await foundUser.save();

          //borramos cookies
          res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
          res.json({ success: true, message:'Sign out successfully!'}); 
          console.log(cookies)
       /*  }else{
            res.json({ success: false, message: 'Authorization fail!' });

        } */
    };
}

interface MyRequest extends Request{
    user: {
      _id: string; // Asegúrate de ajustar esto según la estructura real de tu usuario
      tokens: Array<{
          tokenObject: {
          expiresIn: any,
          token:string
        } }>; // Ajusta esto según la estructura de los tokens
      // Otras propiedades de usuario si las tienes
    };
  }
  