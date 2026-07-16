import type { Block } from './block.model';

/**
 * Respuesta del endpoint /carta/restaurant/:id
 */
export interface MenuResponseData {
  restaurant_id: string;
  restaurant_name: string;
  blocks: Block[];
}

export interface MenuResponse {
  success: boolean;
  message: string;
  data: MenuResponseData;
  timestamp: string;
  statusCode: number;
}

/**
 * Representa la estructura de la respuesta del endpoint /gallery
 */
export interface GalleryItem {
  id: number;
  restaurantId: string;
  title: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GalleryResponse {
  success: boolean;
  message: string;
  data: GalleryItem[];
  timestamp: string;
  statusCode: number;
  pagination: GalleryPagination;
}

/**
 * Representa la estructura de template-images.json
 */
export interface TemplateImages {
  background: string;
  block1: {
    barco: string;
    makis: string[];
  };
  block3: {
    alitasFondo: string;
    alitas2Fondo: string;
  };
  block6: {
    coctelesVertical: string;
  };
}

export interface TemplateImagesResponse {
  data: TemplateImages;
}

export interface Combo {
  id: number;
  restaurant_id: string;
  name: string;
  description: string;
  image_url: string;
  price: string | number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CombosResponse {
  success: boolean;
  message: string;
  data: Combo[];
  timestamp: string;
  statusCode: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
