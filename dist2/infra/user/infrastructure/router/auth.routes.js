"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const mongo_repository_1 = require("../repositories/mongo.repository");
const userUseCase_1 = require("../../application/userUseCase");
const router = (0, express_1.Router)();
/**
 * Iniciar Repository
 */
//const mosckUserRepository = new MongoRepository()
const userRepo = new mongo_repository_1.MongoRepository();
/**
 * Iniciamos casos de uso
 */
const userUseCase = new userUseCase_1.UserUseCase(userRepo);
/**
 * Iniciar User Controller
 */
const userCtrl = new user_controller_1.UserController(userUseCase);
router.post('/users', userCtrl.getUser);
router.post('/signup', userCtrl.signUp);
router.post('/signin', userCtrl.signIn);
router.post('/logout', userCtrl.signOut);
exports.default = router;
