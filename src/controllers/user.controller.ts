import { Request,Response } from "express"
import User, {IUser} from '../models/user'
import jwt from 'jsonwebtoken'
import config from '../config/config'
import {registerUser,getDetailUser} from '../services/user.service'
//crea un ID Y CORREO JWT
function createToken(user: IUser){
   return jwt.sign({id:user.id, email: user.email},config.jwtSecret,{
    expiresIn:'10m',
    algorithm: 'RS256'
   })
}
export const signUp = async (req: Request,res: Response): Promise<Response>=>{
    console.log(req.body)
    if(!req.body.email || !req.body.password){
        return res.status(400).json({msg:'Porfavor envia tu email y contraseña'})
    }
    const user = await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({msg: 'El usuario existe'})
    }
        
    return await registerUser(req.body).then(result=>{
        return res.status(201).json(result);         
     }).catch(err=>{
         return res.sendStatus(400).send({
            message:err.message|| "some error occured"
        });
     })
/* 
    return res.send(201).json(newUser) */
}
export const getUser = async (req:Request, res: Response)=>{
    const {email} = req.query;
    const user = await getDetailUser(`${email}`);
    if(!user){
        return res.status(400).json({msg:'el usuario no existe'})
    }
    res.send({user})
}
export const signIn = async (req: Request,res: Response)=>{
    if(!req.body.email || !req.body.password){
        return res.status(400).json({msg:'Porfavor envia tu email y contraseña'})
    }
   
    const user = await getDetailUser(req.body.email)

    if(!user){
        return res.status(400).json({msg:'el usuario no existe'})
    }
    const password = req.body.password
    const isMatch = await user.comparePasswords(password)

    if(isMatch){
       return res.status(200).json({token:createToken(user)})
    }
    return res.status(400).json({msg:'el correo o contraseña son incorrectas'})
}