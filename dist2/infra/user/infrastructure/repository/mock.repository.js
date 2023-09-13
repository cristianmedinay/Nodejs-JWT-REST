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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockRepository = void 0;
/**
 * MongoDB
 */
const MOCK_USER = { name: 'cristian', email: 'cristian@gmail.com', uuid: '000-000' };
class MockRepository {
    findUserEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = MOCK_USER;
            /* const user = await UserModel.findOne({uuid}) */
            return user;
        });
    }
    findUserById(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = MOCK_USER;
            /* const user = await UserModel.findOne({uuid}) */
            return user;
        });
    }
    registerUser(userIn) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = MOCK_USER;
            /*  const user = await UserModel.create(userIn) */
            return user;
        });
    }
    listUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = [MOCK_USER, MOCK_USER, MOCK_USER];
            /* const user = await UserModel.find() */
            return user;
        });
    }
}
exports.MockRepository = MockRepository;
