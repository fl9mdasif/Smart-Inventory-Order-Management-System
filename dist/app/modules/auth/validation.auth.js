"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidations = exports.loginValidationSchema = void 0;
const zod_1 = require("zod");
exports.loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string({ message: 'Password is required' }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            message: 'Old password is required',
        }),
        newPassword: zod_1.z.string({ message: 'Password is required' }),
    }),
});
const userRegistrationValidation = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(1).max(50),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6).max(30),
        role: zod_1.z.enum(['user', 'admin', 'superAdmin']).default('user'),
        contactNumber: zod_1.z.string(),
        profilePicture: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
});
// const refreshTokenValidationSchema = z.object({
//   cookies: z.object({
//     refreshToken: z.string({
//       message: 'Refresh token is required!',
//     }),
//   }),
// });
exports.authValidations = {
    userRegistrationValidation,
    loginValidationSchema: exports.loginValidationSchema,
    changePasswordValidationSchema,
    // refreshTokenValidationSchema,
};
