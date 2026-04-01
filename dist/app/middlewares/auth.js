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
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppErrors_1 = __importDefault(require("../errors/AppErrors"));
const model_auth_1 = require("../modules/auth/model.auth");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // checking if the token is missing
        if (!token) {
            throw new AppErrors_1.default(http_status_1.default.UNAUTHORIZED, 'You do not have the necessary permissions to access this resource.', // details
            'Unauthorized Access');
        }
        // checking if the given token is valid
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        // console.log('auth middleware', decoded);
        const { role, username, email, iat } = decoded;
        // checking if the user is exist
        const user = yield model_auth_1.User.isUserExists(email);
        if (!user) {
            throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'This User is not found -auth middleware !', 'No user found with the id');
        }
        // check if password update time
        if (user.passwordChangedAt &&
            model_auth_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
            throw new AppErrors_1.default(http_status_1.default.UNAUTHORIZED, 'You do not have the necessary permissions to access this resource.', 'Unauthorized Access');
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppErrors_1.default(http_status_1.default.UNAUTHORIZED, `'${role}' is are not authorized`, 'You do not have the necessary permissions to access this resource.');
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
