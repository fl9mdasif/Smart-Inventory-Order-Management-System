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
exports.orderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const service_order_1 = require("./service.order");
// ── Create Order ───────────────────────────────────────────────────────────────
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_order_1.orderServices.createOrder(req.body);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Order created successfully',
        data: result,
    });
}));
// ── Get All Orders ─────────────────────────────────────────────────────────────
// query: ?status  ?search  ?page  ?limit
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_order_1.orderServices.getAllOrders(req.query);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
    });
}));
// ── Get Single Order ───────────────────────────────────────────────────────────
const getOrderById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_order_1.orderServices.getOrderById(req.params.orderId);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order retrieved successfully',
        data: result,
    });
}));
// ── Update Order Status ────────────────────────────────────────────────────────
// body: { status, note? }
const updateOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, note } = req.body;
    const result = yield service_order_1.orderServices.updateOrderStatus(req.params.orderId, status, note);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order status updated successfully',
        data: result,
    });
}));
// ── Delete Order ───────────────────────────────────────────────────────────────
const deleteOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_order_1.orderServices.deleteOrder(req.params.orderId);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order deleted successfully',
        data: result,
    });
}));
// ── Sales Analytics ────────────────────────────────────────────────────────────
// query: ?period=daily|monthly|yearly
const getSalesAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const period = (_a = req.query.period) !== null && _a !== void 0 ? _a : 'monthly';
    const result = yield service_order_1.orderServices.getSalesAnalytics(period);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Sales analytics retrieved successfully',
        data: result,
    });
}));
exports.orderControllers = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getSalesAnalytics,
};
