export interface ProductPriceRange {
  id: number;
  productId: number;
  quantity: string;
  unit: string;
  price: string;
  bonus: string | null;
  isDefault: boolean;
}

/**
 * Interfaz para los productos del menú.
 */
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  categoryId: string;
  imageUrl: string | null;
  isActive: boolean;
  isRecommended: boolean;
  prices: any[];
  priceRanges: ProductPriceRange[];
}
