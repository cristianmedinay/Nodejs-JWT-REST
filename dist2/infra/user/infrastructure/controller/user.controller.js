"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
/* import User, {IUser} from '../models/user' */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const publicityKey = fs_1.default.readFileSync('jwtRS256.key');
function createToken(user) {
    let i = 'http://localhost/';
    const jwtSecret = 'jwtSecret';
    const signOptions = {
        expiresIn: "10m",
        algorithm: "RS256"
    };
    const signedToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, publicityKey, signOptions);
    /*
   const decodedJwt = jwt.decode(signedToken, { complete: true });
   console.log(`Decoded VC: ${JSON.stringify(decodedJwt)}`);
   const objeto = {
    token: "Bearer " + signedToken
  } */
    const obj = {
        expiresIn: "10m",
        token: signedToken
    };
    return obj;
}
class UserController {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
        this.getUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            /* console.log(req.query) */
            const user = yield this.userUseCase.getDetaiEmail(`${email}`);
            if (!user) {
                return res.status(400).json({ msg: 'el usuario no existe' });
            }
            res.send({ user });
        });
        //registrarse
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            if (!req.body.email || !req.body.password) {
                return res.status(400).json({ msg: 'Porfavor envia tu email y contraseña' });
            }
            const user = yield this.userUseCase.getDetaiEmail(req.body.email);
            if (user) {
                return res.status(400).json({ msg: 'El usuario existe' });
            }
            return yield this.userUseCase.registerUsers(req.body).then(result => {
                return res.status(201).json(result);
            }).catch(err => {
                return res.sendStatus(400).send({
                    message: err.message || "some error occured"
                });
            });
        });
        //login
        this.signIn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email || !req.body.password) {
                return res.status(400).json({ msg: 'Porfavor envia tu email y contraseña' });
            }
            const user = yield this.userUseCase.getDetaiEmail(req.body.email);
            console.log(user);
            if (!user) {
                return res.status(400).json({ msg: 'el usuario no existe', status: false });
            }
            const password = req.body.password;
            const isMatch = yield user.comparePasswords(password);
            const newUser = {
                uuid: user.uuid,
                name: user.name,
                email: user.email
            };
            if (isMatch) {
                const tokenObject = createToken(user);
                let oldTokens = user.tokens || [];
                if (oldTokens.length) {
                    oldTokens = oldTokens.filter((tim) => {
                        const timeDiff = (Date.now() - parseInt(tim.signedAt)) / 1000;
                        if (timeDiff < 86400) {
                            return tim;
                        }
                    });
                }
                yield user.findByIdAndUpdate({ _id: user._id }, {
                    tokens: [...oldTokens, { tokenObject, signedAt: Date.now().toString() }],
                });
                return res.status(200).json({ token: tokenObject.token, status: true, expireTime: tokenObject.expiresIn, user: newUser });
            }
            return res.status(400).json({ msg: 'el correo o contraseña son incorrectas', status: false });
        });
        this.signOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.headers && req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1];
                if (!token) {
                    return res
                        .status(401)
                        .json({ success: false, message: 'Authorization fail!' });
                }
                /*   const {user} = req;
                  const tokens = user.tokens;
              
                  const newTokens = tokens.filter((t: { token: string }) => t.token !== token);
        
        
                   await this.userUseCase.updateToken(req.user._id,newTokens);
         */
                res.json({ success: true, message: req });
            }
        });
    }
}
exports.UserController = UserController;
