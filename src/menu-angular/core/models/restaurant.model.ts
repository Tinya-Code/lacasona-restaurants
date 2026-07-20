export interface BusinessHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface WhatsappConfig {
  enabled: boolean;
  number: string;
  message_template: string;
  show_prices: boolean;
  greeting: string;
  auto_include_restaurant_name: boolean;
}

export interface OrderConfig {
  enabled: boolean;
  max_order_quantity: number;
  delivery_fee: number;
  payment_methods: string[];
  accepts_reservations: boolean;
  delivery_enabled: boolean;
  pickup_enabled: boolean;
}

export interface DeliveryZone {
  name: string;
  fee: number;
}

export interface BusinessConfig {
  business_hours: {
    [key: string]: BusinessHours;
  };
  timezone: string;
  delivery_zones: DeliveryZone[];
  social_media: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
}

export interface RestaurantData {
  restaurant_id: string;
  name: string;
  phone: string;
  address: string;
  location_lat: string;
  location_lng: string;
  is_active: number;
  whatsapp_config: WhatsappConfig;
  display_config: any;
  order_config: OrderConfig;
  business_config: BusinessConfig;
  created_at: string;
  updated_at: string;
}

export interface RestaurantInfo {
  success: boolean;
  message: string;
  data: RestaurantData;
  timestamp: string;
  statusCode: number;
}
