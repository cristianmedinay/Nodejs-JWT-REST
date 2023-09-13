"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
/**
 * Ruta POST HTTP
 *
 */
router.post('/signup', user_controller_1.signUp);
router.post('/signin', user_controller_1.signIn);
router.get('/user', user_controller_1.getUser);
exports.default = router;
