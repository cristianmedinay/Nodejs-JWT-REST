import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './infrastructure/router/auth.routes'
import passport from 'passport'
import passportMiddleware from './infrastructure/middleware/passport'
import specialRoutes from './infrastructure/router/special.routes'
import 'dotenv/config'
const app = express();

//settings
/* app.set('port', process.env.PORT || 3000) */


//middlewares, leer formatos json y urlencoded
app.use(cors());
app.use(morgan('dev'))

console.log(process.env.KEYS)
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(passport.initialize())
passport.use(passportMiddleware)
//routes
/* app.get('/',(req,res)=>{
    res.send(`The api is at http://localhost:${app.get('port')}`)
}) */
app.use(authRoutes);
app.use(specialRoutes);
export default app;