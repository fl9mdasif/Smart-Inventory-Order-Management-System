import { Schema, model } from 'mongoose';
import { TProductDocument } from './interface.product';

const productSchema = new Schema<TProductDocument>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },

        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },

        thumbnail: {
            type: String,
            required: [true, 'Thumbnail URL is required'],
        },

        // ── Inventory ──────────────────────────────────────────────────────────
        stockQuantity: {
            type: Number,
            default: 0,
            min: [0, 'Stock quantity cannot be negative'],
        },
        minStockThreshold: {
            type: Number,
            default: 5,
            min: [0, 'Minimum stock threshold cannot be negative'],
        },

        // ── Status ─────────────────────────────────────────────────────────────
        status: {
            type: String,
            enum: ['active', 'draft', 'archived', 'out_of_stock', 'low_stock'],
            default: 'draft',
        },
    },
    { timestamps: true },
);

// ── Pre-save: auto-manage status based on stock levels ─────────────────────────
productSchema.pre('save', function (next) {
    const qty = this.stockQuantity ?? 0;
    const threshold = this.minStockThreshold ?? 5;

    if (qty === 0) {
        this.status = 'out_of_stock';
    } else if (qty <= threshold) {
        this.status = 'low_stock';
    }
    // Don't override if already draft/archived by user
    next();
});

// ── Pre findOneAndUpdate: sync status on partial updates ───────────────────────
productSchema.pre('findOneAndUpdate', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update = this.getUpdate() as Record<string, any>;
    if (!update) return next();

    const qty = update?.stockQuantity ?? update?.$set?.stockQuantity;
    const threshold = update?.minStockThreshold ?? update?.$set?.minStockThreshold;

    if (qty !== undefined) {
        const resolvedThreshold = threshold ?? 5;
        if (qty === 0) {
            update.$set = { ...update.$set, status: 'out_of_stock' };
        } else if (qty <= resolvedThreshold) {
            update.$set = { ...update.$set, status: 'low_stock' };
        }
    }
    next();
});

// ── Indexes for fast search / filter ──────────────────────────────────────────
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ stockQuantity: 1 });

export const Product = model<TProductDocument>('Product', productSchema);