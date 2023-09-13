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
    expiresIn: "10m",
    algorithm: "RS256" 
  };
function createToken(user: IUser){ 
        const signedToken = jwt.sign({id:user.id, email: user.email},privateKey,signOptions)
         const obj:TokenData = { 
            expiresIn:"10m",
            token:signedToken
        }
        return obj;
}
function refreshToken(user: IUser){ 
        const refreshToken = jwt.sign({id:user.id, email: user.email},privateKey,signOptions)
         const obj:TokenData = { 
            expiresIn:"1d",
            token:refreshToken 
        }
        return obj;
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
    public signIn = async (req: Request,res: Response)=>{
        if(!req.body.email || !req.body.password){
            return res.status(400).json({msg:'Porfavor envia tu email y contraseña'})
        }
       
        const user = await this.userUseCase.getDetaiEmail(req.body.email)
        console.log(user)
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


        if(!isMatch){
            return res.status(400).json({msg:'el correo o contraseña son incorrectas', status:false})
        }

        const tokenObject = createToken(user);
        const tokenRefresh = refreshToken(user);
        let oldTokens = user.tokens || [];
           if (oldTokens.length) {
             oldTokens = oldTokens.filter((tim: any) => {
               const timeDiff = (Date.now() - parseInt(tim.signedAt)) / 1000;
               if (timeDiff < 86400) {
                 return tim;
               }
             });
           }
        await this.userUseCase.updateToken(true,user._id,oldTokens,tokenObject);
        return res
        .cookie('refreshToken', tokenRefresh, { httpOnly: true, sameSite: 'strict' })
        .header('Authorization', tokenObject.token)
        .status(200).json({token:tokenObject.token,status:true,expireTime:tokenObject.expiresIn,user:newUser})
    } 
   public isAuth = async (req:Request, res:Response, next:NextFunction) => {
        if (req.headers && req.headers.authorization) {
          const token = req.headers.authorization.split(' ')[1];
          const refreshToken:any = req.headers.cookie?.split("=");
       /*    console.log(req.headers) */
          
          try {
            const decode:any = jwt.verify(token, privateKey,signOptions);
            const user = await this.userUseCase.getUserId(decode.id);
            console.log(user)
            if (!user) {
              return res.json({ success: false, message: 'unauthorized access!' });
            }
            req.user = user;
            next();
          } catch (error:any) {

             if (!refreshToken[1]) {
            return res.status(401).send('Access Denied. No refresh token provided.');
            }
            if (error.name === 'JsonWebTokenError') {
              return res.json({ success: false, message: 'unauthorized access!' });
            }
            if (error.name === 'TokenExpiredError') {
              return res.json({
                success: false,
                message: 'sesson expired try sign in!',
              });
            } 
            try {
                const decoded:any = jwt.verify(refreshToken[1], privateKey);
                const accessToken = jwt.sign({ user: decoded.user }, privateKey, { expiresIn: '1h' });

                res.cookie('refreshToken', refreshToken[1], { httpOnly: true, sameSite: 'strict' })
                    .header('Authorization', accessToken)
                    .send(decoded.user);
            } catch (error) {
                return res.status(400).send('Invalid Token.');
            }
            res.json({ success: false, message: 'Internal server error!' });
          }   
          res.json({ success: false, message: 'Internal server error!' });
        } else {
          res.json({ success: false, message: 'unauthorized access!' });
        }
    }
    
    public signOut = async (req:Request, res:Response) => {
        if (req.headers && req.headers.authorization) {
          const token = req.headers.authorization.split(' ')[1];
          const {tokens,_id}:any= req.user;
          if (!token) {
            return res
              .status(401)
              .json({ success: false, message: 'Authorization fail!' });
          }
             
          const newTokens = tokens.filter((t:any) =>t.tokenObject.token!==token);
          console.log(newTokens)
          jwt.decode
           await this.userUseCase.updateToken(false,_id,newTokens);

          res.json({ success: true, message:'Sign out successfully!'});
        }else{
            res.json({ success: false, message: 'Authorization fail!' });

        }
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
  