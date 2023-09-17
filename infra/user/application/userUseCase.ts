import { UserRepository } from "../domain/user.repository";
import { UserValue } from "../domain/user.value";

export class UserUseCase  {

    constructor(private readonly userRepository:UserRepository){

    }
    public  registerUsers = async({name,email,password}:{name:string,email:string,password:string})=>{
        const userValue = new UserValue({name,email,password});
        const userCreated = await this.userRepository.registerUser(userValue)
        return userCreated
    }

    public  getDetailUser = async (uuid:string) =>{
        const user = await this.userRepository.findUserById(uuid);
        return user
    }
    public  getDetaiEmail = async (email:string) =>{
        const user = await this.userRepository.findUserEmail(email);
        return user
    }

    public updateToken = async (option:boolean,_id:string,oldTokens?:any,tokenObject?:any,newTokens?:any)=>{
        const user = await this.userRepository.tokenUser(option,_id,oldTokens,tokenObject,newTokens);
        return user
    }

    public getUserId = async (id:any)=>{
        const user = await this.userRepository.findUserId(id);
        return user;
    }
    
    public searchUser = async (tokenUser:any)=>{
        const user = await this.userRepository.findUser(tokenUser);
        return user;
    }
  

}