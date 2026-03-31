import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../auth/const.auth';
import { orderControllers } from './controller.order';
import { orderValidations } from './validation.order';

const router = express.Router();

// All order routes are admin-only (inventory management system)

// POST /api/orders — create a new order
// body: { productId, customerName, quantity, unitPrice, shippingAddress, discount? }
router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(orderValidations.placeOrderValidationSchema),
    orderControllers.createOrder,
);

// GET /api/orders — list all orders with search + filter + pagination
// query: ?status=pending|confirmed|shipped|delivered|cancelled|returned
//        ?search=<customer/product name>  ?page  ?limit
router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    orderControllers.getAllOrders,
);

// GET /api/orders/analytics/sales — sales chart data (must be before /:orderId)
// query: ?period=daily|monthly|yearly
router.get(
    '/analytics/sales',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    orderControllers.getSalesAnalytics,
);

// GET /api/orders/:orderId — single order detail
router.get(
    '/:orderId',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    orderControllers.getOrderById,
);

// PATCH /api/orders/:orderId/status — update lifecycle status
// body: { status, note? }
router.patch(
    '/:orderId/status',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(orderValidations.updateOrderStatusValidationSchema),
    orderControllers.updateOrderStatus,
);

// DELETE /api/orders/:orderId — delete order (restores stock if not yet delivered)
router.delete(
    '/:orderId',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    orderControllers.deleteOrder,
);

export const orderRoutes = router;
