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
const passport_jwt_1 = require("passport-jwt");
const user_1 = __importDefault(require("../model/user"));
const fs_1 = __importDefault(require("fs"));
const privateKey = fs_1.default.readFileSync('jwtRS256.key.pub');
//PASSPORT JWT
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: privateKey,
    algorithms: ['RS256'],
};
//CONSULTA A LA BASE DE DATOS
// PAYLOAD BUSCAMOS UN ID EN LA BASE DE DATOS
// null = error & user de la base de datos
exports.default = new passport_jwt_1.Strategy(opts, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(payload.id);
        if (user) {
            return done(null, user);
        }
        console.log('error');
        return done(null, false);
    }
    catch (error) {
        console.log(error);
    }
}));
