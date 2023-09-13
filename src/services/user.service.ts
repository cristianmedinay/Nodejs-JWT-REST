import UserModel from "../models/user"
import {UserInterface} from '../types/user.types'
import User, {IUser} from '../models/user'


/**
 * CREA un usuario
 * @param user 
 * @returns 
 */
const registerUser = async (user:String)=>{
    const newUser = new User(user)
    return await newUser.save()
}

/**
 * CONSULTAR usuario
 * @param email 
 * @returns 
 */
const getDetailUser = async (email:string)=>{
    return await User.findOne({email:email});
}
export { registerUser,getDetailUser}