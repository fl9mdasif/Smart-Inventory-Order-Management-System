"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const const_auth_1 = require("../auth/const.auth");
const controller_product_1 = require("./controller.product");
const validation_product_1 = require("./validation.product");
const router = express_1.default.Router();
// POST /api/products — create a new product (admin / superAdmin)
router.post('/', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_product_1.productValidations.createProductValidationSchema), controller_product_1.productControllers.createProduct);
// GET /api/products — list all products
router.get('/', controller_product_1.productControllers.getAllProducts);
// GET /api/products/restock-queue — products needing restock, sorted by urgency
router.get('/restock-queue', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_product_1.productControllers.getRestockQueue);
// GET /api/products/:productId — single product by ObjectId or slug (public)
router.get('/:productId', controller_product_1.productControllers.getSingleProduct);
// PATCH /api/products/:productId — update product fields (admin / superAdmin)
router.patch('/:productId', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_product_1.productValidations.updateProductValidationSchema), controller_product_1.productControllers.updateProduct);
// DELETE /api/products/:productId (admin / superAdmin)
router.delete('/:productId', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_product_1.productControllers.deleteProduct);
exports.productRoutes = router;
