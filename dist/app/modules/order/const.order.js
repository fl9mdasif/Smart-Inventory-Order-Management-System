"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHIPPING_CHARGE = exports.FREE_SHIPPING_THRESHOLD = exports.PAYMENT_STATUS = exports.PAYMENT_METHOD = exports.ORDER_STATUS = void 0;
exports.ORDER_STATUS = {
    pending: 'pending',
    confirmed: 'confirmed',
    processing: 'processing',
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled',
    returned: 'returned',
};
exports.PAYMENT_METHOD = {
    cod: 'cod',
    bkash: 'bkash',
    nagad: 'nagad',
    card: 'card',
    bank: 'bank',
};
exports.PAYMENT_STATUS = {
    pending: 'pending',
    paid: 'paid',
    failed: 'failed',
    refunded: 'refunded',
};
/** Orders with subtotal >= this value get free shipping */
exports.FREE_SHIPPING_THRESHOLD = 10000;
/** Flat shipping charge when below the threshold (BDT) */
exports.SHIPPING_CHARGE = 60;
