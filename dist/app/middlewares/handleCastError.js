"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const statusCode = 400;
    return {
        statusCode,
        message: 'Invalid ID',
        errorMessage: `${err.value} is not a valid ID!`,
        errorDetails: err,
    };
};
exports.default = handleCastError;
