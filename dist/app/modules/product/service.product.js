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
exports.productServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const model_product_1 = require("./model.product");
// ── Helpers ───────────────────────────────────────────────────────────────────
const isObjectId = (val) => /^[a-f\d]{24}$/i.test(val);
// ── Create ────────────────────────────────────────────────────────────────────
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Case-insensitive duplicate name check
    const existingName = yield model_product_1.Product.findOne({
        name: { $regex: `^${payload.name.trim()}$`, $options: 'i' },
    });
    if (existingName) {
        throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A product named "${existingName.name}" already exists.`, 'Duplicate name');
    }
    // Duplicate slug check
    const existingSlug = yield model_product_1.Product.findOne({ slug: payload.slug });
    if (existingSlug) {
        throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A product with slug "${payload.slug}" already exists.`, 'Duplicate slug');
    }
    const product = yield model_product_1.Product.create(payload);
    return product.populate('category', 'name slug');
});
// ── Get All (search + filter + sort + paginate) ───────────────────────────────
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { 
    //  search
    search, 
    //  filters
    category, status, minStock, maxStock, lowStockOnly, 
    //  sort & paginate
    sort = '-createdAt', page = 1, limit = 12, } = query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter = {};
    // Full-text / substring search on name & description
    if (search) {
        const term = search;
        filter.$or = [
            { name: { $regex: term, $options: 'i' } },
            { description: { $regex: term, $options: 'i' } },
        ];
    }
    // Filter by category (ObjectId string)
    if (category)
        filter.category = category;
    // Filter by status (active | draft | archived | out_of_stock | low_stock)
    if (status)
        filter.status = status;
    // Filter by stock range
    if (minStock !== undefined || maxStock !== undefined) {
        filter.stockQuantity = {};
        if (minStock !== undefined)
            filter.stockQuantity.$gte = Number(minStock);
        if (maxStock !== undefined)
            filter.stockQuantity.$lte = Number(maxStock);
    }
    // Shortcut: only products at or below their minStockThreshold
    if (lowStockOnly === 'true' || lowStockOnly === true) {
        filter.$expr = { $lte: ['$stockQuantity', '$minStockThreshold'] };
    }
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const [products, total] = yield Promise.all([
        model_product_1.Product.find(filter)
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(limitNum),
        model_product_1.Product.countDocuments(filter),
    ]);
    return {
        meta: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
        data: products,
    };
});
// ── Get Single (by ObjectId or slug) ─────────────────────────────────────────
const getSingleProduct = (idOrSlug) => __awaiter(void 0, void 0, void 0, function* () {
    const product = isObjectId(idOrSlug)
        ? yield model_product_1.Product.findById(idOrSlug).populate('category', 'name slug')
        : yield model_product_1.Product.findOne({ slug: idOrSlug }).populate('category', 'name slug');
    if (!product) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product not found', 'No product matches the given id or slug');
    }
    return product;
});
// ── Update ────────────────────────────────────────────────────────────────────
const updateProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Duplicate name check (exclude self)
    if (payload.name) {
        const existing = yield model_product_1.Product.findOne({
            name: { $regex: `^${payload.name.trim()}$`, $options: 'i' },
            _id: { $ne: id },
        });
        if (existing) {
            throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A product named "${existing.name}" already exists.`, 'Duplicate name');
        }
    }
    // Duplicate slug check (exclude self)
    if (payload.slug) {
        const existing = yield model_product_1.Product.findOne({ slug: payload.slug, _id: { $ne: id } });
        if (existing) {
            throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A product with slug "${payload.slug}" already exists.`, 'Duplicate slug');
        }
    }
    const updated = yield model_product_1.Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate('category', 'name slug');
    if (!updated) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product not found', 'No product found with the given id');
    }
    return updated;
});
// ── Delete ────────────────────────────────────────────────────────────────────
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield model_product_1.Product.findByIdAndDelete(id);
    if (!deleted) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product not found', 'No product found with the given id');
    }
    return deleted;
});
// ── Restock Queue ─────────────────────────────────────────────────────────────
/**
 * Returns products whose stock is at or below their minStockThreshold,
 * ordered by stockQuantity ASC (lowest stock = highest urgency).
 * Excludes products the admin has manually dismissed.
 * Adds a derived `priority` field: High / Medium / Low.
 */
const getRestockQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield model_product_1.Product.find({
        $expr: { $lt: ['$stockQuantity', '$minStockThreshold'] },
        restockIgnored: { $ne: true },
    })
        .populate('category', 'name slug')
        .sort({ stockQuantity: 1 }) // lowest stock first
        .lean(); // plain JS objects so we can add fields
    return products.map((p) => {
        var _a, _b;
        const qty = (_a = p.stockQuantity) !== null && _a !== void 0 ? _a : 0;
        const threshold = (_b = p.minStockThreshold) !== null && _b !== void 0 ? _b : 5;
        let priority;
        if (qty === 0) {
            priority = 'High';
        }
        else if (qty <= Math.ceil(threshold * 0.5)) {
            priority = 'Medium';
        }
        else {
            priority = 'Low';
        }
        return Object.assign(Object.assign({}, p), { priority });
    });
});
exports.productServices = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getRestockQueue,
};
