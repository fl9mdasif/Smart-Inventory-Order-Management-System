"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidations = void 0;
const zod_1 = require("zod");
// ── Shared status enum ─────────────────────────────────────────────────────────
const productStatusEnum = zod_1.z.enum(['active', 'draft', 'archived', 'out_of_stock', 'low_stock']);
// ── Create ─────────────────────────────────────────────────────────────────────
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ message: 'Product name is required' })
            .trim()
            .min(1, 'Product name cannot be empty'),
        slug: zod_1.z
            .string({ message: 'Slug is required' })
            .trim()
            .min(1)
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: 'Slug must be lowercase letters, numbers, and hyphens only',
        }),
        description: zod_1.z
            .string({ message: 'Description is required' })
            .min(1, 'Description cannot be empty'),
        category: zod_1.z
            .string({ message: 'Category ID is required' })
            .regex(/^[a-f\d]{24}$/i, { message: 'Category must be a valid MongoDB ObjectId' }),
        thumbnail: zod_1.z
            .string({ message: 'Thumbnail URL is required' })
            .url({ message: 'Thumbnail must be a valid URL' }),
        // ── Inventory ──────────────────────────────────────────────────────────
        stockQuantity: zod_1.z
            .number()
            .int({ message: 'Stock quantity must be a whole number' })
            .min(0, 'Stock quantity cannot be negative')
            .default(0),
        minStockThreshold: zod_1.z
            .number()
            .int({ message: 'Min stock threshold must be a whole number' })
            .min(0, 'Min stock threshold cannot be negative')
            .default(5),
        status: productStatusEnum.optional().default('draft'),
    }),
});
// ── Update ─────────────────────────────────────────────────────────────────────
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z.string().trim().min(1).optional(),
        slug: zod_1.z
            .string()
            .trim()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: 'Slug must be lowercase letters, numbers, and hyphens only',
        })
            .optional(),
        description: zod_1.z.string().min(1).optional(),
        category: zod_1.z
            .string()
            .regex(/^[a-f\d]{24}$/i, { message: 'Category must be a valid MongoDB ObjectId' })
            .optional(),
        thumbnail: zod_1.z.string().url().optional(),
        stockQuantity: zod_1.z
            .number()
            .int()
            .min(0, 'Stock quantity cannot be negative')
            .optional(),
        minStockThreshold: zod_1.z
            .number()
            .int()
            .min(0, 'Min stock threshold cannot be negative')
            .optional(),
        status: productStatusEnum.optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided to update',
    }),
});
exports.productValidations = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
