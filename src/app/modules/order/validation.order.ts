import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

// ── Shipping Address ───────────────────────────────────────────────────────────
const shippingAddressSchema = z.object({
    fullName: z.string({ message: 'Full name is required' }).trim().min(1),
    phone: z.string({ message: 'Phone is required' }).trim().min(1),
    address: z.string({ message: 'Address is required' }).trim().min(1),
    city: z.string({ message: 'City is required' }).trim().min(1),
    district: z.string({ message: 'District is required' }).trim().min(1),
    postalCode: z.string().optional(),
    country: z.string().optional().default('Bangladesh'),
});

// ── Create Order ───────────────────────────────────────────────────────────────
const placeOrderValidationSchema = z.object({
    body: z.object({
        productId: z
            .string({ message: 'Product ID is required.' })
            .regex(objectIdRegex, 'Product ID must be a valid MongoDB ObjectId'),

        customerName: z
            .string({ message: 'Customer name is required' })
            .trim()
            .min(1, 'Customer name cannot be empty'),

        quantity: z
            .number({ message: 'Quantity is required' })
            .int('Quantity must be a whole number')
            .min(1, 'Quantity must be at least 1'),

        subtotal: z
            .number({ message: 'Subtotal is required' })
            .min(0, 'Subtotal cannot be negative'),

        shippingAddress: shippingAddressSchema,

        discount: z
            .number()
            .min(0, 'Discount cannot be negative')
            .optional()
            .default(0),
    }),
});

// ── Update Order Status (admin) ────────────────────────────────────────────────
const updateOrderStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(
            ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
            { message: 'Invalid order status' },
        ),
        note: z.string().optional(),
    }),
});

export const orderValidations = {
    placeOrderValidationSchema,
    updateOrderStatusValidationSchema,
};
