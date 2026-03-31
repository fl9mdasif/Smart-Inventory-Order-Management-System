import { Document, Model, Types } from 'mongoose';


export type TProductStatus = 'active' | 'out_of_stock' | 'low_stock' | 'draft' | 'archived';

export interface TProduct {
    name: string;
    slug: string;
    description: string;
    category: Types.ObjectId;
    thumbnail: string;
    status?: TProductStatus;
    stockQuantity?: number;
    minStockThreshold?: number;

}

export interface TProductDocument extends TProduct, Document { }

export interface TProductModel extends Model<TProductDocument> { }