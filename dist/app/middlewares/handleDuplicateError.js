"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
const handleDuplicateError = (err) => {
    const statusCode = 400;
    return {
        statusCode,
        message: 'Duplicate key value',
        errorMessage: err.message,
    };
};
exports.default = handleDuplicateError;
