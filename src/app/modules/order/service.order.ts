import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { Product } from '../product/model.product';
import { Order } from './model.order';
import { TOrder, TOrderStatus } from './interface.order';

// ── Create Order (admin) ───────────────────────────────────────────────────────
const createOrder = async (payload: TOrder
) => {
    const { productId, customerName, quantity, subtotal, shippingAddress, discount = 0 } = payload;

    // ── 1. Fetch product ───────────────────────────────────────────────────────
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found', 'Product not found');
    }

    // ── 2. Inactive product guard ──────────────────────────────────────────────
    const orderableStatuses = ['active', 'low_stock'];
    if (!orderableStatuses.includes(product.status as string)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'This product is currently unavailable.',
            'Product unavailable',
        );
    }

    // ── 3. Duplicate active order guard ────────────────────────────────────────
    // Prevent placing a new order for a product that already has a pending order open
    const duplicateOrder = await Order.findOne({
        productId: product._id,
        orderStatus: { $in: ['pending'] },
        // customerName: customerName,
    });
    if (duplicateOrder) {
        throw new AppError(
            httpStatus.CONFLICT,
            'This product is already added to the order.',
            'Duplicate order',
        );
    }

    // ── 4. Stock validation ────────────────────────────────────────────────────
    const available = product.stockQuantity ?? 0;

    if (available === 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `"${product.name}" is currently out of stock`,
            'Out of stock',
        );
    }

    if (quantity > available) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Only ${available} item${available !== 1 ? 's' : ''} available in stock for "${product.name}"`,
            'Insufficient stock',
        );
    }

    // ── 5. Total amount — subtotal from client, discount applied server-side ───
    const totalAmount = Math.max(0, subtotal - discount);

    // ── 4. Save order ──────────────────────────────────────────────────────────
    const order = await Order.create({
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
    const threshold = product.minStockThreshold ?? 5;

    const newStatus =
        newQty === 0 ? 'out_of_stock' :
            newQty <= threshold ? 'low_stock' :
                product.status;

    await Product.findByIdAndUpdate(productId, {
        stockQuantity: newQty,
        status: newStatus,
    });

    await Product.findByIdAndUpdate(productId, {
        stockQuantity: newQty,
        status: newStatus,
    });

    return order.populate('productId', 'name slug thumbnail status stockQuantity');
};

// ── Get All Orders ─────────────────────────────────────────────────────────────
const getAllOrders = async (query: Record<string, unknown>) => {
    const { status, search, page = 1, limit = 20 } = query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    // Filter by order status
    if (status) filter.orderStatus = status;

    // Search by customer name, product name, or shipping details
    if (search) {
        const term = search as string;
        filter.$or = [
            { customerName: { $regex: term, $options: 'i' } },
            { productName: { $regex: term, $options: 'i' } },
            { 'shippingAddress.fullName': { $regex: term, $options: 'i' } },
            { 'shippingAddress.phone': { $regex: term, $options: 'i' } },
        ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [orders, total] = await Promise.all([
        Order.find(filter)
            .populate('productId', 'name slug thumbnail status stockQuantity')
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum),
        Order.countDocuments(filter),
    ]);

    return {
        meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
        data: orders,
    };
};

// ── Get Single Order ───────────────────────────────────────────────────────────
const getOrderById = async (orderId: string) => {
    const order = await Order.findById(orderId)
        .populate('productId', 'name slug thumbnail status stockQuantity');

    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found', 'Order not found');
    }
    return order;
};

// ── Update Order Status ────────────────────────────────────────────────────────
const updateOrderStatus = async (orderId: string, status: TOrderStatus, note?: string) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found', 'Order not found');
    }

    order.orderStatus = status;
    order.statusHistory.push({ status, note, changedAt: new Date() });

    if (status === 'delivered') order.deliveredAt = new Date();

    if (status === 'cancelled') {
        order.cancelledAt = new Date();
        order.cancelReason = note;

        // ── Restore stock on cancellation ──────────────────────────────────────
        const product = await Product.findById(order.productId);
        if (product) {
            const restoredQty = (product.stockQuantity ?? 0) + order.quantity;
            const threshold = product.minStockThreshold ?? 5;

            const newStatus =
                restoredQty > threshold ? 'active' :
                    restoredQty > 0 ? 'low_stock' :
                        'out_of_stock';

            await Product.findByIdAndUpdate(order.productId, {
                stockQuantity: restoredQty,
                status: newStatus,
            });

            await Product.findByIdAndUpdate(order.productId, {
                stockQuantity: restoredQty,
                status: newStatus,
            });
        }
    }

    await order.save();
    return order;
};

// ── Delete Order ───────────────────────────────────────────────────────────────
const deleteOrder = async (orderId: string) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found', 'Order not found');
    }

    // Restore stock if order was not yet delivered
    if (!['delivered', 'returned'].includes(order.orderStatus as string)) {
        const product = await Product.findById(order.productId);
        if (product) {
            const restoredQty = (product.stockQuantity ?? 0) + order.quantity;
            const threshold = product.minStockThreshold ?? 5;

            const newStatus =
                restoredQty > threshold ? 'active' :
                    restoredQty > 0 ? 'low_stock' :
                        'out_of_stock';

            await Product.findByIdAndUpdate(order.productId, {
                stockQuantity: restoredQty,
                status: newStatus,
            });

            await Product.findByIdAndUpdate(order.productId, {
                stockQuantity: restoredQty,
                status: newStatus,
            });
        }
    }

    await Order.findByIdAndDelete(orderId);
    return order;
};

// ── Sales Analytics ────────────────────────────────────────────────────────────
const getSalesAnalytics = async (period: 'daily' | 'monthly' | 'yearly') => {
    const format =
        period === 'monthly' ? '%Y-%m' :
            period === 'yearly' ? '%Y' :
                '%Y-%m-%d';

    const result = await Order.aggregate([
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
};

export const orderServices = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getSalesAnalytics,
};
