"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
const createSendResponse = (res, data) => {
    // console.log('res', data);
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
    });
};
const getSendResponse = (res, data) => {
    var _a, _b, _c;
    // console.log('res', data);
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        meta: {
            page: parseInt(String((_a = data === null || data === void 0 ? void 0 : data.meta) === null || _a === void 0 ? void 0 : _a.page)),
            limit: parseInt(String((_b = data === null || data === void 0 ? void 0 : data.meta) === null || _b === void 0 ? void 0 : _b.limit)),
            total: parseInt(String((_c = data === null || data === void 0 ? void 0 : data.meta) === null || _c === void 0 ? void 0 : _c.total)),
        },
        data: data.data,
    });
};
exports.response = { createSendResponse, getSendResponse };
