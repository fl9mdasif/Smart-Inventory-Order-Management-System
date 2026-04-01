"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const const_auth_1 = require("../auth/const.auth");
const controller_order_1 = require("./controller.order");
const validation_order_1 = require("./validation.order");
const router = express_1.default.Router();
// All order routes are admin-only (inventory management system)
// POST /api/orders — create a new order
// body: { productId, customerName, quantity, unitPrice, shippingAddress, discount? }
router.post('/', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_order_1.orderValidations.placeOrderValidationSchema), controller_order_1.orderControllers.createOrder);
// GET /api/orders — list all orders with search + filter + pagination
// query: ?status=pending|confirmed|shipped|delivered|cancelled|returned
//        ?search=<customer/product name>  ?page  ?limit
router.get('/', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_order_1.orderControllers.getAllOrders);
// GET /api/orders/analytics/sales — sales chart data (must be before /:orderId)
// query: ?period=daily|monthly|yearly
router.get('/analytics/sales', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_order_1.orderControllers.getSalesAnalytics);
// GET /api/orders/:orderId — single order detail
router.get('/:orderId', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_order_1.orderControllers.getOrderById);
// PATCH /api/orders/:orderId/status — update lifecycle status
// body: { status, note? }
router.patch('/:orderId/status', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_order_1.orderValidations.updateOrderStatusValidationSchema), controller_order_1.orderControllers.updateOrderStatus);
// DELETE /api/orders/:orderId — delete order (restores stock if not yet delivered)
router.delete('/:orderId', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_order_1.orderControllers.deleteOrder);
exports.orderRoutes = router;
