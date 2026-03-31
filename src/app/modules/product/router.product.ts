import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../auth/const.auth';
import { productControllers } from './controller.product';
import { productValidations } from './validation.product';

const router = express.Router();

// POST /api/products — create a new product (admin / superAdmin)
router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(productValidations.createProductValidationSchema),
    productControllers.createProduct,
);

// GET /api/products — list all products
// Query params:
//   search        - substring match on name or description
//   category      - MongoDB ObjectId string
//   status        - active | draft | archived | out_of_stock | low_stock
//   minStock      - minimum stockQuantity
//   maxStock      - maximum stockQuantity
//   lowStockOnly  - true → products at or below their minStockThreshold
//   sort          - e.g. -createdAt | name | stockQuantity
//   page          - page number (default 1)
//   limit         - results per page (default 12)
router.get('/', productControllers.getAllProducts);

// GET /api/products/:productId — single product by ObjectId or slug (public)
router.get('/:productId', productControllers.getSingleProduct);

// PATCH /api/products/:productId — update product fields (admin / superAdmin)
router.patch(
    '/:productId',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(productValidations.updateProductValidationSchema),
    productControllers.updateProduct,
);

// PATCH /api/products/:productId/adjust-stock — increment / decrement stock
// body: { delta: number }  (positive = restock, negative = deduct)
router.patch(
    '/:productId/adjust-stock',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    productControllers.adjustStock,
);

// DELETE /api/products/:productId (admin / superAdmin)
router.delete(
    '/:productId',
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    productControllers.deleteProduct,
);

export const productRoutes = router;
