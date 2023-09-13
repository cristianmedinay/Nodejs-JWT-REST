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
exports.signIn = exports.getUser = exports.signUp = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const user_service_1 = require("../services/user.service");
//crea un ID Y CORREO JWT
function createToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.default.jwtSecret, {
        expiresIn: '10m',
        algorithm: 'RS256'
    });
}
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Porfavor envia tu email y contraseña' });
    }
    const user = yield user_1.default.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ msg: 'El usuario existe' });
    }
    return yield (0, user_service_1.registerUser)(req.body).then(result => {
        return res.status(201).json(result);
    }).catch(err => {
        return res.sendStatus(400).send({
            message: err.message || "some error occured"
        });
    });
    /*
        return res.send(201).json(newUser) */
});
exports.signUp = signUp;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    const user = yield (0, user_service_1.getDetailUser)(`${email}`);
    if (!user) {
        return res.status(400).json({ msg: 'el usuario no existe' });
    }
    res.send({ user });
});
exports.getUser = getUser;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Porfavor envia tu email y contraseña' });
    }
    const user = yield (0, user_service_1.getDetailUser)(req.body.email);
    if (!user) {
        return res.status(400).json({ msg: 'el usuario no existe' });
    }
    const password = req.body.password;
    const isMatch = yield user.comparePasswords(password);
    if (isMatch) {
        return res.status(200).json({ token: createToken(user) });
    }
    return res.status(400).json({ msg: 'el correo o contraseña son incorrectas' });
});
exports.signIn = signIn;
