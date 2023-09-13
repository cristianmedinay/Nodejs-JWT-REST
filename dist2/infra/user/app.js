"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./infrastructure/router/auth.routes"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./infrastructure/middleware/passport"));
const special_routes_1 = __importDefault(require("./infrastructure/router/special.routes"));
require("dotenv/config");
const app = (0, express_1.default)();
//settings
/* app.set('port', process.env.PORT || 3000) */
//middlewares, leer formatos json y urlencoded
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
console.log(process.env.KEYS);
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
passport_1.default.use(passport_2.default);
//routes
/* app.get('/',(req,res)=>{
    res.send(`The api is at http://localhost:${app.get('port')}`)
}) */
app.use(auth_routes_1.default);
app.use(special_routes_1.default);
exports.default = app;
