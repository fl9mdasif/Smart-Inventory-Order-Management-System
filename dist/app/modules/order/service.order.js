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
exports.orderServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const model_product_1 = require("../product/model.product");
const model_order_1 = require("./model.order");
const service_activity_1 = require("../activity/service.activity");
// ── Create Order (admin) ───────────────────────────────────────────────────────
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { productId, customerName, quantity, subtotal, shippingAddress, discount = 0 } = payload;
    // ── 1. Fetch product ───────────────────────────────────────────────────────
    const product = yield model_product_1.Product.findById(productId);
    if (!product) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product not found', 'Product not found');
    }
    // ── 2. Inactive product guard ──────────────────────────────────────────────
    const orderableStatuses = ['active', 'low_stock'];
    if (!orderableStatuses.includes(product.status)) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'This product is currently unavailable.', 'Product unavailable');
    }
    // ── 3. Duplicate active order guard ────────────────────────────────────────
    // Prevent placing a new order for a product that already has a pending order open
    const duplicateOrder = yield model_order_1.Order.findOne({
        productId: product._id,
        orderStatus: { $in: ['pending'] },
        // customerName: customerName,
    });
    if (duplicateOrder) {
        throw new AppErrors_1.default(http_status_1.default.CONFLICT, 'This product is already added to the order.', 'Duplicate order');
    }
    // ── 4. Stock validation ────────────────────────────────────────────────────
    const available = (_a = product.stockQuantity) !== null && _a !== void 0 ? _a : 0;
    if (available === 0) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `"${product.name}" is currently out of stock`, 'Out of stock');
    }
    if (quantity > available) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `Only ${available} item${available !== 1 ? 's' : ''} available in stock for "${product.name}"`, 'Insufficient stock');
    }
    // ── 5. Total amount — subtotal from client, discount applied server-side ───
    const totalAmount = Math.max(0, subtotal - discount);
    // ── 4. Save order ──────────────────────────────────────────────────────────
    const order = yield model_order_1.Order.create({
        productId: product._id,
        customerName,
        productName: product.name,
        quantity,
        shippingAddress,
        subtotal,
        discount,
        totalAmount,
        statusHistory: [{ status: 'pending', note: 'Order created' }],
    });
    // ── 5. Deduct stock & auto-update product status ───────────────────────────
    const newQty = available - quantity;
    const threshold = (_b = product.minStockThreshold) !== null && _b !== void 0 ? _b : 5;
    const newStatus = newQty === 0 ? 'out_of_stock' :
        newQty <= threshold ? 'low_stock' :
            product.status;
    yield model_product_1.Product.findByIdAndUpdate(productId, {
        stockQuantity: newQty,
        status: newStatus,
    });
    yield model_product_1.Product.findByIdAndUpdate(productId, {
        stockQuantity: newQty,
        status: newStatus,
    });
    // ── 6. Log Activity ────────────────────────────────────────────────────────
    yield service_activity_1.ActivityService.createLog({
        type: 'order',
        message: `Order #${order._id.toString().slice(-6).toUpperCase()} created for ${customerName}`,
        metadata: { orderId: order._id, productId: product._id }
    });
    return order.populate('productId', 'name slug thumbnail status stockQuantity');
});
// ── Get All Orders ─────────────────────────────────────────────────────────────
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, search, page = 1, limit = 20 } = query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter = {};
    // Filter by order status
    if (status)
        filter.orderStatus = status;
    // Search by customer name, product name, or shipping details
    if (search) {
        const term = search;
        filter.$or = [
            { customerName: { $regex: term, $options: 'i' } },
            { productName: { $regex: term, $options: 'i' } },
            { 'shippingAddress.fullName': { $regex: term, $options: 'i' } },
            { 'shippingAddress.phone': { $regex: term, $options: 'i' } },
        ];
    }
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const [orders, total] = yield Promise.all([
        model_order_1.Order.find(filter)
            .populate('productId', 'name slug thumbnail status stockQuantity')
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum),
        model_order_1.Order.countDocuments(filter),
    ]);
    return {
        meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
        data: orders,
    };
});
// ── Get Single Order ───────────────────────────────────────────────────────────
const getOrderById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield model_order_1.Order.findById(orderId)
        .populate('productId', 'name slug thumbnail status stockQuantity');
    if (!order) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
    }
    return order;
});
// ── Update Order Status ────────────────────────────────────────────────────────
const updateOrderStatus = (orderId, status, note) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const order = yield model_order_1.Order.findById(orderId);
    if (!order) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
    }
    order.orderStatus = status;
    order.statusHistory.push({ status, note, changedAt: new Date() });
    if (status === 'delivered')
        order.deliveredAt = new Date();
    if (status === 'cancelled') {
        order.cancelledAt = new Date();
        order.cancelReason = note;
        // ── Restore stock on cancellation ──────────────────────────────────────
        const product = yield model_product_1.Product.findById(order.productId);
        if (product) {
            const restoredQty = ((_a = product.stockQuantity) !== null && _a !== void 0 ? _a : 0) + order.quantity;
            const threshold = (_b = product.minStockThreshold) !== null && _b !== void 0 ? _b : 5;
            const newStatus = restoredQty > threshold ? 'active' :
                restoredQty > 0 ? 'low_stock' :
                    'out_of_stock';
            yield model_product_1.Product.findByIdAndUpdate(order.productId, {
                stockQuantity: restoredQty,
                status: newStatus,
            });
            yield model_product_1.Product.findByIdAndUpdate(order.productId, {
                stockQuantity: restoredQty,
                status: newStatus,
            });
        }
    }
    yield order.save();
    // ── Log Activity ──────────────────────────────────────────────────────────
    yield service_activity_1.ActivityService.createLog({
        type: 'order',
        message: `Order #${order._id.toString().slice(-6).toUpperCase()} marked as ${status}`,
        metadata: { orderId: order._id }
    });
    return order;
});
// ── Delete Order ───────────────────────────────────────────────────────────────
const deleteOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const order = yield model_order_1.Order.findById(orderId);
    if (!order) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
    }
    // Restore stock if order was not yet delivered
    if (!['delivered', 'returned'].includes(order.orderStatus)) {
        const product = yield model_product_1.Product.findById(order.productId);
        if (product) {
            const restoredQty = ((_a = product.stockQuantity) !== null && _a !== void 0 ? _a : 0) + order.quantity;
            const threshold = (_b = product.minStockThreshold) !== null && _b !== void 0 ? _b : 5;
            const newStatus = restoredQty > threshold ? 'active' :
                restoredQty > 0 ? 'low_stock' :
                    'out_of_stock';
            yield model_product_1.Product.findByIdAndUpdate(order.productId, {
                stockQuantity: restoredQty,
                status: newStatus,
            });
            yield model_product_1.Product.findByIdAndUpdate(order.productId, {
                stockQuantity: restoredQty,
                status: newStatus,
            });
        }
    }
    yield model_order_1.Order.findByIdAndDelete(orderId);
    return order;
});
// ── Sales Analytics ────────────────────────────────────────────────────────────
const getSalesAnalytics = (period) => __awaiter(void 0, void 0, void 0, function* () {
    const format = period === 'monthly' ? '%Y-%m' :
        period === 'yearly' ? '%Y' :
            '%Y-%m-%d';
    const result = yield model_order_1.Order.aggregate([
        { $match: { orderStatus: 'delivered' } },
        {
            $group: {
                _id: { $dateToString: { format, date: '$createdAt' } },
                revenue: { $sum: '$totalAmount' },
                orders: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    return result.map((item) => ({
        date: item._id,
        revenue: item.revenue,
        orders: item.orders,
    }));
});
exports.orderServices = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getSalesAnalytics,
};
