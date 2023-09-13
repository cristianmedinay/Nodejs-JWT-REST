import {Router} from 'express'
import { signIn, signUp, getUser } from '../controllers/user.controller';

const router = Router();
/**
 * Ruta POST HTTP
 * 
 */


router.post('/signup',signUp)
router.post('/signin',signIn)
router.get('/user',getUser)

export default router;