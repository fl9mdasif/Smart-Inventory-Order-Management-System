"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['order', 'product', 'system'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    metadata: {
        orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' },
        productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
        additionalInfo: { type: String },
    },
}, {
    timestamps: true,
});
exports.Activity = (0, mongoose_1.model)('Activity', activitySchema);
