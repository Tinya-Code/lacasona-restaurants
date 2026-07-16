export interface CartItem {
  id: string;
  originalProductId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  selectedEntry?: {
    qty: number | string;
    price: number | string;
    bonus?: string | null;
  };
}
