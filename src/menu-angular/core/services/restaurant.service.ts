import { Injectable, computed, inject, signal } from "@angular/core";
import type { RestaurantInfo } from "../models/restaurant.model";
import { MenuService } from "./menu.service";

@Injectable({
  providedIn: "root",
})
export class RestaurantService {
  private readonly menuService = inject(MenuService);

  // Internal state
  private readonly _restaurantInfo = signal<RestaurantInfo | null>(null);

  constructor() {
    this.loadRestaurantInfo();
  }

  private loadRestaurantInfo(): void {
    this.menuService.getRestaurantInfo().subscribe((info) => {
      this._restaurantInfo.set(info);
    });
  }

  // Exposed signals
  readonly restaurant = computed(() => {
    const data = this._restaurantInfo()?.data;
    if (!data) return null;
    return {
      name: data.name,
      slug: data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : "",
      template_id: "default",
      phone: data.phone,
      address: data.address,
      location: {
        lat: Number(data.location_lat || 0),
        lng: Number(data.location_lng || 0)
      }
    };
  });

  readonly settings = computed(() => {
    const data = this._restaurantInfo()?.data;
    if (!data) return null;
    return {
      whatsapp_config: data.whatsapp_config,
      display_config: data.display_config,
      order_config: data.order_config,
      business_config: data.business_config,
      description: "",
      tags: [] as string[],
      logo_url: null as string | null
    };
  });

  readonly orderConfig = computed(() => this._restaurantInfo()?.data?.order_config);
  readonly whatsappConfig = computed(() => this._restaurantInfo()?.data?.whatsapp_config);
  readonly businessConfig = computed(() => this._restaurantInfo()?.data?.business_config);
  readonly socialMedia = computed(() => this._restaurantInfo()?.data?.business_config?.social_media);
  readonly restaurantConfig = computed(() => this._restaurantInfo()?.data);
}
