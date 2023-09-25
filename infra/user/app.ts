import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './infrastructure/router/auth.routes'
import passport from 'passport'
import passportMiddleware from './infrastructure/middleware/passport'
import specialRoutes from './infrastructure/router/special.routes'
import cookies  from 'cookie-parser';
import 'dotenv/config'
const app = express();

//settings
/* app.set('port', process.env.PORT || 3000) */


//middlewares, leer formatos json y urlencoded

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookies());
app.use(cors({
    origin: ['http://localhost:3000','http://192.168.1.37:3000','http://127.0.0.1:3000','http://localhost:3001'],
    credentials: true
}));
app.use(morgan('dev'))

console.log(process.env.KEYS)

app.use(passport.initialize())
passport.use(passportMiddleware)
//routes
/* app.get('/',(req,res)=>{
    res.send(`The api is at http://localhost:${app.get('port')}`)
}) */
app.use(authRoutes);
app.use(specialRoutes);
export default app;