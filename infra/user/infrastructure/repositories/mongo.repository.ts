import { UserEntity } from "../../domain/user.entity";
import { UserRepository } from "../../domain/user.repository";
import User from '../model/user'


/**
 * MongoDB
 */

export class MongoRepository implements UserRepository{
    async findUserEmail(email: string): Promise<any> {
        const user = await User.findOne({email:email})
        return user
    }
    async findUserById(uuid: string): Promise<any> {
       const user = await User.findOne({uuid})
       return user
    }
    async findUserId(id: any): Promise<any> {
       const user = await User.findById(id)
       return user
    }
    async registerUser(newUser: UserEntity): Promise<any> {
        const user = new User(newUser)
        return  await user.save()
    }
    async listUser(): Promise<any> {
       const user = await User.find()
       return user
    }
    async findUser(user:any): Promise<any> {
       const u = await User.findOne(user).exec();
       return u;
    }
 
    async tokenUser(option:boolean,id:string,oldTokens:any,tokenObject?:any,newTokens?:any): Promise<any> {

    /* const tokenD = await User.findByIdAndUpdate(id, { tokens: newTokens });
      return tokenD; */
      let tokenD;
      if(option){
        tokenD = await User.findByIdAndUpdate(id, {
            tokens: [...oldTokens, { tokenObject, signedAt: Date.now().toString() }],
        });
      }else{
        console.log('first')
        tokenD = await User.findByIdAndUpdate(id, { tokens: {tokenObject:newTokens} });
       /*  tokenD = await User.findByIdAndUpdate(id, { tokens: {tokenObject: {
            expiresIn: '',
            token:newTokens
          }} }); */
      }


      return tokenD;
    }

}