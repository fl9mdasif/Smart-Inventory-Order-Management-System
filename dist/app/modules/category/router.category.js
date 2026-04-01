"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const const_auth_1 = require("../auth/const.auth");
const controller_category_1 = require("./controller.category");
const validation_category_1 = require("./validation.category");
const router = express_1.default.Router();
// POST /api/categories  — admin / superAdmin only
router.post('/', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_category_1.categoryValidations.createCategoryValidationSchema), controller_category_1.categoryControllers.createCategory);
// GET /api/categories  — public
router.get('/', controller_category_1.categoryControllers.getAllCategories);
// GET /api/categories/:categoryId  — public (accepts ObjectId or slug)
router.get('/:categoryId', controller_category_1.categoryControllers.getSingleCategory);
// PATCH /api/categories/:categoryId  — admin / superAdmin only
router.patch('/:categoryId', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_category_1.categoryValidations.updateCategoryValidationSchema), controller_category_1.categoryControllers.updateCategory);
// PATCH /api/categories/:categoryId/toggle-status  — admin / superAdmin only
router.patch('/:categoryId/toggle-status', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_category_1.categoryControllers.toggleCategoryStatus);
// DELETE /api/categories/:categoryId  — superAdmin only
router.delete('/:categoryId', (0, auth_1.default)(const_auth_1.USER_ROLE.superAdmin, const_auth_1.USER_ROLE.admin), controller_category_1.categoryControllers.deleteCategory);
exports.categoryRoutes = router;
