import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { orderServices } from './service.order';

// ── Create Order ───────────────────────────────────────────────────────────────
const createOrder = catchAsync(async (req, res) => {
    const result = await orderServices.createOrder(req.body);
    response.createSendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Order created successfully',
        data: result,
    });
});

// ── Get All Orders ─────────────────────────────────────────────────────────────
// query: ?status  ?search  ?page  ?limit
const getAllOrders = catchAsync(async (req, res) => {
    const result = await orderServices.getAllOrders(req.query);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
    });
});

// ── Get Single Order ───────────────────────────────────────────────────────────
const getOrderById = catchAsync(async (req, res) => {
    const result = await orderServices.getOrderById(req.params.orderId);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order retrieved successfully',
        data: result,
    });
});

// ── Update Order Status ────────────────────────────────────────────────────────
// body: { status, note? }
const updateOrderStatus = catchAsync(async (req, res) => {
    const { status, note } = req.body;
    const result = await orderServices.updateOrderStatus(req.params.orderId, status, note);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order status updated successfully',
        data: result,
    });
});

// ── Delete Order ───────────────────────────────────────────────────────────────
const deleteOrder = catchAsync(async (req, res) => {
    const result = await orderServices.deleteOrder(req.params.orderId);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order deleted successfully',
        data: result,
    });
});

// ── Sales Analytics ────────────────────────────────────────────────────────────
// query: ?period=daily|monthly|yearly
const getSalesAnalytics = catchAsync(async (req, res) => {
    const period = (req.query.period as 'daily' | 'monthly' | 'yearly') ?? 'monthly';
    const result = await orderServices.getSalesAnalytics(period);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sales analytics retrieved successfully',
        data: result,
    });
});

export const orderControllers = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getSalesAnalytics,
};