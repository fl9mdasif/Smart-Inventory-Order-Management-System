"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidations = void 0;
const zod_1 = require("zod");
const createCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ message: 'Name is required' }).trim().min(1),
        slug: zod_1.z
            .string({ message: 'Slug is required' })
            .trim()
            .min(1)
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: 'Slug must be lowercase letters, numbers, and hyphens only (e.g. cooking-oil)',
        }),
        description: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional().default(true),
        // order: z.number().int().min(0).optional().default(0),
    }),
});
const updateCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(1).optional(),
        slug: zod_1.z
            .string()
            .trim()
            .min(1)
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: 'Slug must be lowercase letters, numbers, and hyphens only',
        })
            .optional(),
        description: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
        // order: z.number().int().min(0).optional(),
    }),
});
exports.categoryValidations = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
};
