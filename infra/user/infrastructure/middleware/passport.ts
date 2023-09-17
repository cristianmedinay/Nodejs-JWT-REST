import { Strategy,ExtractJwt,StrategyOptions } from "passport-jwt";
import config from '../config/config'
import User from '../model/user'
import fs from 'fs';
const privateKey = fs.readFileSync('jwtRS256.key.pub');


//PASSPORT JWT
const opts:StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:privateKey,
    algorithms:['RS256'],
    
}

//CONSULTA A LA BASE DE DATOS
// PAYLOAD BUSCAMOS UN ID EN LA BASE DE DATOS
// null = error & user de la base de datos
export default new Strategy(opts, async (payload, done)=>{
   try {
        const user = await User.findOne({email:payload.email})
        if(user){
            return done(null,user)
        }
                console.log('error')

        return done(null,false)
   } catch (error) {
        console.log(error)
   }
})