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
exports.categoryServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const model_category_1 = require("./model.category");
// Create category
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for duplicate name (case-insensitive)
    const existingName = yield model_category_1.Category.findOne({
        name: { $regex: `^${payload.name}$`, $options: 'i' },
    });
    if (existingName) {
        throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A category named '${existingName.name}' already exists.`, 'Duplicate name');
    }
    // Check for duplicate slug
    const existingSlug = yield model_category_1.Category.findOne({ slug: payload.slug });
    if (existingSlug) {
        throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A category with slug '${payload.slug}' already exists.`, 'Duplicate slug');
    }
    const category = yield model_category_1.Category.create(payload);
    return category;
});
// Get all categories
const getAllCategories = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { isActive, sort = 'order' } = query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter = {};
    if (isActive !== undefined) {
        filter.isActive = isActive === 'true' || isActive === true;
    }
    const categories = yield model_category_1.Category.find(filter).sort(sort);
    return categories;
});
// Get single category by id or slug
const getSingleCategory = (idOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    // Try ObjectId first, fall back to slug
    const isObjectId = /^[a-f\d]{24}$/i.test(idOrSlug);
    const category = isObjectId
        ? yield model_category_1.Category.findById(idOrSlug)
        : yield model_category_1.Category.findOne({ slug: idOrSlug });
    if (!category) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Category not found', 'No category found with the given id or slug');
    }
    return category;
});
// Update category
const updateCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // If name is being changed, check for duplicate (case-insensitive)
    if (payload.name) {
        const existingName = yield model_category_1.Category.findOne({
            name: { $regex: `^${payload.name}$`, $options: 'i' },
            _id: { $ne: id },
        });
        if (existingName) {
            throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A category named '${existingName.name}' already exists.`, 'Duplicate name');
        }
    }
    // If slug is being changed, check for duplicate
    if (payload.slug) {
        const existingSlug = yield model_category_1.Category.findOne({
            slug: payload.slug,
            _id: { $ne: id },
        });
        if (existingSlug) {
            throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A category with slug '${payload.slug}' already exists.`, 'Duplicate slug');
        }
    }
    const updated = yield model_category_1.Category.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updated) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Category not found', 'No category found with the given id');
    }
    return updated;
});
// Delete category
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield model_category_1.Category.findByIdAndDelete(id);
    if (!deleted) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Category not found', 'No category found with the given id');
    }
    return deleted;
});
// Toggle isActive
const toggleCategoryStatus = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield model_category_1.Category.findById(id);
    if (!category) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Category not found', 'No category found with the given id');
    }
    category.isActive = !category.isActive;
    yield category.save();
    return category;
});
exports.categoryServices = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
};
