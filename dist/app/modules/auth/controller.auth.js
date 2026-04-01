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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const service_auth_1 = require("./service.auth");
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const result = yield service_auth_1.authServices.registerUser(req.body);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User registered successfully',
        data: result,
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_auth_1.authServices.loginUser(req.body);
    const { data, accessToken, refreshToken } = result;
    // Set refresh token in cookie if available
    if (refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax', // Use lax for better compatibility during development
        });
    }
    // Set access token in cookie
    res.cookie('accessToken', accessToken, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
    });
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User login successfully!',
        data: {
            user: data.jwtPayload,
            accessToken,
        },
    });
}));
const logoutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User logged out successfully!',
        data: null,
    });
}));
// // change password
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordData = __rest(req.body, []);
    // console.log('controler', req.user, req.body);
    const result = yield service_auth_1.authServices.changePassword(req.user, passwordData);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password is updated successfully!',
        data: {
            data: result,
        },
    });
}));
// refresh
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve refreshToken
    const { refreshToken } = req.cookies;
    // const refreshToken = localStorage.getItem('refreshToken') as string | null;
    if (refreshToken) {
        // console.log('r', refreshToken);
        const result = yield service_auth_1.authServices.refreshToken(refreshToken);
        sendResponse_1.response.createSendResponse(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Refresh token is retrieved successfully!',
            data: result,
        });
    }
}));
exports.authControllers = {
    loginUser,
    registerUser,
    changePassword,
    refreshToken,
    logoutUser,
};
