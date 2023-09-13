"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValue = void 0;
const uuid_1 = require("uuid");
class UserValue {
    constructor({ name, email, password }) {
        this.uuid = (0, uuid_1.v4)();
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
exports.UserValue = UserValue;
