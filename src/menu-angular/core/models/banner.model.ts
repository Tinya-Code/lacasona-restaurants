export interface Banner {
  id: string;
  restaurantId: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BannersResponse {
  statusCode: number;
  message: string;
  data: Banner[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
