import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";
import {
  type GalleryResponse,
  type MenuResponse,
  type TemplateImagesResponse,
  type CombosResponse,
  type PromotionsResponse,
  type ApiPromotion,
  type BannersResponse,
} from "../models/menu.model";
import type { RestaurantInfo } from "../models/restaurant.model";
import { map } from "rxjs/operators";

// Local data imports (used as fallback when HTTP is unavailable)
import combosLocal from "../../../data/combos.json";
import galleryLocal from "../../../data/gallery.json";
import menuDataLocal from "../../../data/menu_render.json";
import promotionsLocal from "../../../data/promotions.json";
import restaurantLocal from "../../../data/restaurant.json";
import templateImagesLocal from "../../../data/template-images.json";
import recommendedLocal from "../../../data/recommended.json";
import bannersLocal from "../../../data/banners.json";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  private useApi = true;
  private readonly apiUrl = "https://tinyacode.com";
  private readonly restaurantId = "00000000-0000-0000-0000-000000000001";

  private readonly http: HttpClient | null;

  constructor() {
    this.http = inject(HttpClient, { optional: true }) as HttpClient | null;
    if (!this.http) {
      this.useApi = false;
    }
  }

  setUseApi(value: boolean): void {
    this.useApi = value;
  }

  /**
   * Get menu data (carta). Products include embedded priceRanges[].
   */
  getMenuData(): Observable<MenuResponse> {
    if (this.useApi && this.http) {
      return this.http
        .get<MenuResponse>(
          `${this.apiUrl}/carta/restaurant/${this.restaurantId}`
        )
        .pipe(catchError(() => of(menuDataLocal as unknown as MenuResponse)));
    }
    return of(menuDataLocal as unknown as MenuResponse);
  }

  /**
   * Get restaurant information and settings.
   */
  getRestaurantInfo(): Observable<RestaurantInfo> {
    if (this.useApi && this.http) {
      return this.http
        .get<RestaurantInfo>(
          `${this.apiUrl}/restaurants/${this.restaurantId}/settings`
        )
        .pipe(
          catchError(() => of(restaurantLocal as unknown as RestaurantInfo))
        );
    }
    return of(restaurantLocal as unknown as RestaurantInfo);
  }

  /**
   * Get gallery data.
   */
  getGalleryData(): Observable<GalleryResponse> {
    if (this.useApi && this.http) {
      return this.http
        .get<GalleryResponse>(
          `${this.apiUrl}/restaurants/${this.restaurantId}/gallery`
        )
        .pipe(
          catchError(() => of(galleryLocal as unknown as GalleryResponse))
        );
    }
    return of(galleryLocal as unknown as GalleryResponse);
  }

  /**
   * Get template images (local only).
   */
  getTemplateImages(): Observable<TemplateImagesResponse> {
    return of(templateImagesLocal as TemplateImagesResponse);
  }

  /**
   * Get all combos.
   */
  getCombos(): Observable<CombosResponse> {
    if (this.useApi && this.http) {
      return this.http
        .get<CombosResponse>(
          `${this.apiUrl}/restaurants/${this.restaurantId}/combos`
        )
        .pipe(catchError(() => of(combosLocal as unknown as CombosResponse)));
    }
    return of(combosLocal as unknown as CombosResponse);
  }

  /**
   * Get all promotions.
   */
  getPromotions(): Observable<{ data: any[] }> {
    if (this.useApi && this.http) {
      return this.http
        .get<PromotionsResponse>(
          `${this.apiUrl}/restaurants/${this.restaurantId}/products/promotions`
        )
        .pipe(
          map((response) => {
            const mappedData = (response.data || []).map((apiPromo: ApiPromotion) => {
              const hasPrices = apiPromo.prices && apiPromo.prices.length > 0;
              const firstPriceEntry = hasPrices ? apiPromo.prices[0] : null;

              // 1. Name preference
              const name = firstPriceEntry?.name || apiPromo.name || "";

              // 2. Description preference
              const description = firstPriceEntry?.description || apiPromo.description || "";

              // 3. Price preference (original price)
              const basePrice = apiPromo.price
                ? Number(apiPromo.price)
                : firstPriceEntry?.price
                  ? Number(firstPriceEntry.price)
                  : 0;

              // 4. Discounted price preference (promotional price)
              const discountedPrice = firstPriceEntry?.price
                ? Number(firstPriceEntry.price)
                : basePrice;

       

              return {
                id: String(apiPromo.id),
                name,
                description,
                price: basePrice,
                discountedPrice: discountedPrice,
                cloudinary_id: "",
                url:apiPromo.image_url || "",
                // Keep references to raw fields if components need them
                category_id: apiPromo.category_id,
                restaurant_id: apiPromo.restaurant_id,
                is_active: apiPromo.is_active,
                is_recommended: apiPromo.is_recommended,
                prices: apiPromo.prices,
                priceRanges: apiPromo.priceRanges
              };
            });
            return { ...response, data: mappedData };
          }),
          catchError(() => {
            // Map local promotions to match the structure if they don't have it
            const mappedLocal = (promotionsLocal.data || []).map((p: any) => ({
              id: String(p.id),
              name: p.name,
              description: p.description,
              price: Number(p.price),
              discountedPrice: Number(p.discountedPrice),
              cloudinary_id: p.cloudinary_id || "",
              url: p.url || "/images/combos/combo-1.png",
              prices: [],
              priceRanges: []
            }));
            return of({ success: true, data: mappedLocal });
          })
        );
    }
    const mappedLocal = (promotionsLocal.data || []).map((p: any) => ({
      id: String(p.id),
      name: p.name,
      description: p.description,
      price: Number(p.price),
      discountedPrice: Number(p.discountedPrice),
      cloudinary_id: p.cloudinary_id || "",
      url: p.url || "/images/combos/combo-1.png",
      prices: [],
      priceRanges: []
    }));
    return of({ success: true, data: mappedLocal });
  }

  /**
   * Get all recommended items (local only for now).
   */
  getRecommended(): Observable<{ data: any[] }> {
    return of(recommendedLocal as { data: any[] });
  }

  /**
   * Get active banners.
   */
  getBanners(): Observable<BannersResponse> {
    if (this.useApi && this.http) {
      return this.http
        .get<BannersResponse>(
          `${this.apiUrl}/restaurants/${this.restaurantId}/banners`
        )
        .pipe(
          map((res) => {
            if (!res || !res.data || res.data.length === 0) {
              return bannersLocal as unknown as BannersResponse;
            }
            return res;
          }),
          catchError(() => of(bannersLocal as unknown as BannersResponse))
        );
    }
    return of(bannersLocal as unknown as BannersResponse);
  }
}
