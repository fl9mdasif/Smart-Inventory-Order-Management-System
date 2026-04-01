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
exports.ActivityService = void 0;
const model_activity_1 = require("./model.activity");
const createLog = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_activity_1.Activity.create(payload);
    return result;
});
const getRecentActivities = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 10) {
    const result = yield model_activity_1.Activity.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('metadata.productId', 'name slug')
        .populate('metadata.orderId', 'customerName productName');
    return result;
});
exports.ActivityService = {
    createLog,
    getRecentActivities,
};
