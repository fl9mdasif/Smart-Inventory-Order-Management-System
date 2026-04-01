import { Schema, model } from 'mongoose';
import { TOrderDocument } from './interface.order';

// ── Shipping Address sub-schema ───────────────────────────────────────────────
const shippingAddressSchema = new Schema(
    {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        postalCode: { type: String },
        country: { type: String, default: 'Bangladesh' },
    },
    { _id: false },
);

// ── Status History sub-schema ─────────────────────────────────────────────────
const statusHistorySchema = new Schema(
    {
        status: { type: String, required: true },
        note: { type: String },
        changedAt: { type: Date, default: Date.now },
    },
    { _id: false },
);

// ── Main Order Schema ─────────────────────────────────────────────────────────
const orderSchema = new Schema<TOrderDocument>(
    {

        // Single product reference
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },

        // Customer & product name snapshots (preserved even if records change)
        customerName: { type: String, required: true, trim: true },
        productName: { type: String, required: true, trim: true },

        // How many units ordered
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1'],
        },

        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },

        // ── Pricing ───────────────────────────────────────────────────────────
        /** unit price × quantity */
        subtotal: {
            type: Number,
            required: true,
            min: [0, 'Subtotal cannot be negative'],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
        },
        totalAmount: {
            type: Number,
            required: true,
            min: [0, 'Total amount cannot be negative'],
        },


        // ── Order Lifecycle ───────────────────────────────────────────────────
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
            default: 'pending',
        },
        statusHistory: {
            type: [statusHistorySchema],
            default: [],
        },

        deliveredAt: { type: Date },
        cancelledAt: { type: Date },
        cancelReason: { type: String },
    },
    { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────────────────────────────
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ product: 1 });
orderSchema.index({ orderStatus: 1 });

export const Order = model<TOrderDocument>('Order', orderSchema);