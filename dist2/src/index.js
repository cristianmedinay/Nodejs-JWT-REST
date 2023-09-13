"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./database"));
const port = process.env.PORT || 3000;
(0, database_1.default)();
app_1.default.listen(port, () => console.log(`Listo por el puerto ${port}`));
/* app.listen(app.get('port'));console.log('server on port', app.get('port'))  */
