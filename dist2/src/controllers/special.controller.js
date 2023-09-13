"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.special = void 0;
const special = (req, res) => {
    return res.json({ msg: `Hey ${req.body.email}!` });
};
exports.special = special;
