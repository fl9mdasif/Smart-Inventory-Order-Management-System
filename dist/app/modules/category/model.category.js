"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true }, // "Cooking Oil"
    slug: { type: String, required: true, unique: true }, // "cooking-oil"
    description: { type: String },
    isActive: { type: Boolean, default: true },
    thumbnail: { type: String }, // category banner/icon
    // order: { type: Number, default: 0 },  // for manual sorting in UI
    // Self-referencing for nested categories
    // parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    // null = top-level category
}, { timestamps: true });
// categorySchema.index({ parent: 1 });
exports.Category = (0, mongoose_1.model)('Category', categorySchema);
