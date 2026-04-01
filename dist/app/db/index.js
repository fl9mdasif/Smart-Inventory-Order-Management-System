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
const config_1 = __importDefault(require("../config"));
const const_auth_1 = require("../modules/auth/const.auth");
const model_auth_1 = require("../modules/auth/model.auth");
const superUser = {
    username: 'superAdmin',
    email: 'superAdmin@gmail.com',
    password: config_1.default.super_admin_pass,
    contactNumber: '01605855875',
    role: const_auth_1.USER_ROLE.superAdmin,
    status: 'in-progress',
    //   isDeleted: false,
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    //when database is connected, we will check is there any user who is super admin
    const isSuperAdminExits = yield model_auth_1.User.findOne({ role: const_auth_1.USER_ROLE.superAdmin });
    if (!isSuperAdminExits) {
        yield model_auth_1.User.create(superUser);
    }
});
exports.default = seedSuperAdmin;
