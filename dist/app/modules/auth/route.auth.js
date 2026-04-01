"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validation_auth_1 = require("./validation.auth");
const controller_auth_1 = require("./controller.auth");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const const_auth_1 = require("./const.auth");
const router = express_1.default.Router();
// register a user
router.post('/register', (0, validateRequest_1.default)(validation_auth_1.authValidations.userRegistrationValidation), controller_auth_1.authControllers.registerUser);
// login a user
router.post('/login', (0, validateRequest_1.default)(validation_auth_1.authValidations.loginValidationSchema), controller_auth_1.authControllers.loginUser);
// change password
router.post('/change-password', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_auth_1.authValidations.changePasswordValidationSchema), controller_auth_1.authControllers.changePassword);
// logout a user
router.post('/logout', controller_auth_1.authControllers.logoutUser);
// refresh token
router.post('/refresh-token', controller_auth_1.authControllers.refreshToken);
exports.authRoute = router;
