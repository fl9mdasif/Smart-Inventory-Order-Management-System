"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidations = void 0;
const zod_1 = require("zod");
const objectIdRegex = /^[a-f\d]{24}$/i;
// ── Shipping Address ───────────────────────────────────────────────────────────
const shippingAddressSchema = zod_1.z.object({
    fullName: zod_1.z.string({ message: 'Full name is required' }).trim().min(1),
    phone: zod_1.z.string({ message: 'Phone is required' }).trim().min(1),
    address: zod_1.z.string({ message: 'Address is required' }).trim().min(1),
    city: zod_1.z.string({ message: 'City is required' }).trim().min(1),
    district: zod_1.z.string({ message: 'District is required' }).trim().min(1),
    postalCode: zod_1.z.string().optional(),
    country: zod_1.z.string().optional().default('Bangladesh'),
});
// ── Create Order ───────────────────────────────────────────────────────────────
const placeOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z
            .string({ message: 'Product ID is required.' })
            .regex(objectIdRegex, 'Product ID must be a valid MongoDB ObjectId'),
        customerName: zod_1.z
            .string({ message: 'Customer name is required' })
            .trim()
            .min(1, 'Customer name cannot be empty'),
        quantity: zod_1.z
            .number({ message: 'Quantity is required' })
            .int('Quantity must be a whole number')
            .min(1, 'Quantity must be at least 1'),
        subtotal: zod_1.z
            .number({ message: 'Subtotal is required' })
            .min(0, 'Subtotal cannot be negative'),
        shippingAddress: shippingAddressSchema,
        discount: zod_1.z
            .number()
            .min(0, 'Discount cannot be negative')
            .optional()
            .default(0),
    }),
});
// ── Update Order Status (admin) ────────────────────────────────────────────────
const updateOrderStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderStatus: zod_1.z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'], { message: 'Invalid order status' }),
        note: zod_1.z.string().optional(),
    }),
});
exports.orderValidations = {
    placeOrderValidationSchema,
    updateOrderStatusValidationSchema,
};
