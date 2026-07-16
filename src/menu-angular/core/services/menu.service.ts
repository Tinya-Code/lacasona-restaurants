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
} from "../models/menu.model";
import type { RestaurantInfo } from "../models/restaurant.model";

// Local data imports (used as fallback when HTTP is unavailable)
import combosLocal from "../../../data/combos.json";
import galleryLocal from "../../../data/gallery.json";
import menuDataLocal from "../../../data/menu_render.json";
import promotionsLocal from "../../../data/promotions.json";
import restaurantLocal from "../../../data/restaurant.json";
import templateImagesLocal from "../../../data/template-images.json";
import recommendedLocal from "../../../data/recommended.json";

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
   * Get all promotions (local only for now).
   */
  getPromotions(): Observable<{ data: any[] }> {
    return of(promotionsLocal as { data: any[] });
  }

  /**
   * Get all recommended items (local only for now).
   */
  getRecommended(): Observable<{ data: any[] }> {
    return of(recommendedLocal as { data: any[] });
  }
}
