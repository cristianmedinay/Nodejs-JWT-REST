import { UserEntity } from "../../domain/user.entity";
import { UserRepository } from "../../domain/user.repository";


/**
 * MongoDB
 */
const MOCK_USER={name:'cristian',email:'cristian@gmail.com',uuid:'000-000'}
export class MockRepository implements UserRepository{
    findUser(user: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    findUserId(user: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    tokenUser(option:boolean,id:string,oldTokens:string,tokenObject?:any,newTokens?:any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    TokenUser(oldTokens:any,token:any,_id:any): Promise<UserEntity[] | null> {
        throw new Error("Method not implemented.");
    }
    async findUserEmail(email: string): Promise<any> {
        const user = MOCK_USER
        /* const user = await UserModel.findOne({uuid}) */
        return user
    }
    async findUserById(uuid: string): Promise<any> {
        const user = MOCK_USER
       /* const user = await UserModel.findOne({uuid}) */
       return user
    }
    async registerUser(userIn: UserEntity): Promise<UserEntity | any> {
        const user = MOCK_USER
       /*  const user = await UserModel.create(userIn) */
        return user
    }
    async listUser(): Promise<any> {
        const user = [MOCK_USER,MOCK_USER,MOCK_USER]
       /* const user = await UserModel.find() */
       return user
    }

}