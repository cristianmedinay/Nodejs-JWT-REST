import { Strategy,ExtractJwt,StrategyOptions } from "passport-jwt";
import config from '../config/config'
import User from '../models/user'


//PASSPORT JWT
const opts:StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:config.jwtSecret,
}

//CONSULTA A LA BASE DE DATOS
// PAYLOAD BUSCAMOS UN ID EN LA BASE DE DATOS
// null = error & user de la base de datos
export default new Strategy(opts, async (payload, done)=>{
   try {
        const user = await User.findById(payload.id)
        if(user){
            return done(null,user)
        }
        return done(null,false)
   } catch (error) {
        console.log(error)
   }
})