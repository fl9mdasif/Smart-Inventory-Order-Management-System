import { Document, Model, Types } from 'mongoose';

// ── Enums ─────────────────────────────────────────────────────────────────────
// export type TPaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card' | 'bank';
// export type TPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type TOrderStatus =
    | 'pending'
    | 'confirmed'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';





export interface TShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode?: string;
    country?: string;
}

export interface TStatusHistoryEntry {
    status: TOrderStatus;
    note?: string;
    changedAt?: Date;
}

// ── Main Order Interface ───────────────────────────────────────────────────────
export interface TOrder {
    // user: Types.ObjectId;
    productId: Types.ObjectId;
    customerName: string;
    productName: string;
    quantity: number;
    shippingAddress: TShippingAddress;
    subtotal: number;
    statusHistory: TStatusHistoryEntry[];

    discount?: number;
    orderStatus?: TOrderStatus;
    deliveredAt?: Date;
    cancelledAt?: Date;
    cancelReason?: string;


}

export interface TOrderDocument extends TOrder, Document { }
export interface TOrderModel extends Model<TOrderDocument> { }
