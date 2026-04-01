"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
// ── Shipping Address sub-schema ───────────────────────────────────────────────
const shippingAddressSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, default: 'Bangladesh' },
}, { _id: false });
// ── Status History sub-schema ─────────────────────────────────────────────────
const statusHistorySchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    note: { type: String },
    changedAt: { type: Date, default: Date.now },
}, { _id: false });
// ── Main Order Schema ─────────────────────────────────────────────────────────
const orderSchema = new mongoose_1.Schema({
    // Single product reference
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
// ── Indexes ───────────────────────────────────────────────────────────────────
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ product: 1 });
orderSchema.index({ orderStatus: 1 });
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
