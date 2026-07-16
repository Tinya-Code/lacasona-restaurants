/**
 * Representa una entrada de rango de precio (ahora embebida en el producto).
 * Se mantiene la interfaz para compatibilidad con product-detail.
 */
export interface PriceRangeEntry {
  id: number;
  productId: number;
  quantity: string;
  unit: string;
  price: string | number;
  bonus: string | null;
  isDefault: boolean;
  // Legacy aliases for backwards compat with product-detail template
  qty?: string | number;
}
