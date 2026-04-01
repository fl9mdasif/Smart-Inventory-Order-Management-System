export type TActivityType = 'order' | 'product' | 'system';

export interface TActivity {
  type: TActivityType;
  message: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    additionalInfo?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
