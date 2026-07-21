import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import type { Observable } from "rxjs";
import { of, throwError, timer } from "rxjs";
import { catchError, map, shareReplay, retry, timeout, delay, scan } from "rxjs/operators";
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
import { RestaurantContextService } from "./restaurant-context.service";

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
  private readonly requestTimeout = 10000; // 10 segundos de timeout
  private readonly maxRetries = 2; // Máximo de reintentos
  private readonly retryDelay = 2000; // 2 segundos entre reintentos

  // Caché para optimizar peticiones
  private menuCache$: Observable<MenuResponse> | null = null;
  private restaurantCache$: Observable<RestaurantInfo> | null = null;
  private galleryCache$: Observable<GalleryResponse> | null = null;
  private combosCache$: Observable<CombosResponse> | null = null;
  private promotionsCache$: Observable<{ data: any[] }> | null = null;
  private bannersCache$: Observable<BannersResponse> | null = null;

  // Estado de conexión
  private isOnline = signal(true);

  private readonly http: HttpClient;
  private readonly context: RestaurantContextService;

  constructor() {
    this.http = inject(HttpClient);
    this.context = inject(RestaurantContextService);
  }

  setUseApi(value: boolean): void {
    this.useApi = value;
    // Limpiar caché al cambiar el modo
    this.clearCache();
  }

  /**
   * Manejo centralizado de errores con fallback
   */
  private handleError<T>(fallback: T, operation: string): (error: any) => Observable<T> {
    return (error: any) => {
      console.error(`API error en ${operation}:`, error);
      this.isOnline.set(false);
      return of(fallback);
    };
  }

  /**
   * Validación segura de datos numéricos
   */
  private toNumber(value: any): number {
    const n = parseFloat(value);
    return isNaN(n) ? 0 : n;
  }

  /**
   * Validación de estructura de respuesta
   */
  private validateResponse<T>(response: any, requiredFields: string[]): T {
    if (!response) {
      throw new Error('Respuesta nula');
    }
    
    for (const field of requiredFields) {
      if (!(field in response)) {
        throw new Error(`Campo requerido faltante: ${field}`);
      }
    }
    
    return response as T;
  }

  /**
   * Retry con backoff exponencial
   */
  private retryWithBackoff<T>(maxAttempts: number, delayMs: number) {
    return (errors: Observable<any>) => errors.pipe(
      scan((acc, error) => {
        if (acc >= maxAttempts) throw error;
        return acc + 1;
      }, 0),
      delay(delayMs)
    );
  }

  /**
   * Limpiar toda la caché
   */
  clearCache(): void {
    this.menuCache$ = null;
    this.restaurantCache$ = null;
    this.galleryCache$ = null;
    this.combosCache$ = null;
    this.promotionsCache$ = null;
    this.bannersCache$ = null;
  }

  /**
   * Obtener el ID del restaurante actual
   */
  private getRestaurantId(): string {
    return this.context.getRestaurantId();
  }

  /**
   * Verificar estado de conexión
   */
  getConnectionStatus(): boolean {
    return this.isOnline();
  }

  /**
   * Get menu data (carta). Products include embedded priceRanges[].
   */
  getMenuData(): Observable<MenuResponse> {
    if (!this.menuCache$) {
      this.menuCache$ = this.http
        .get<MenuResponse>(
          `${this.apiUrl}/carta/restaurant/${this.getRestaurantId()}`
        )
        .pipe(
          timeout(this.requestTimeout),
          retry(this.maxRetries),
          map((res) => this.validateResponse<MenuResponse>(res, ['data'])),
          shareReplay(1),
          catchError(this.handleError(menuDataLocal as unknown as MenuResponse, 'getMenuData'))
        );
    }
    return this.menuCache$;
  }

  /**
   * Get restaurant information and settings.
   */
  getRestaurantInfo(): Observable<RestaurantInfo> {
    if (!this.restaurantCache$) {
      this.restaurantCache$ = this.http
        .get<RestaurantInfo>(
          `${this.apiUrl}/restaurants/${this.getRestaurantId()}/settings`
        )
        .pipe(
          timeout(this.requestTimeout),
          retry(this.maxRetries),
          map((res) => this.validateResponse<RestaurantInfo>(res, ['data'])),
          shareReplay(1),
          catchError(this.handleError(restaurantLocal as unknown as RestaurantInfo, 'getRestaurantInfo'))
        );
    }
    return this.restaurantCache$;
  }

  /**
   * Get gallery data.
   */
  getGalleryData(): Observable<GalleryResponse> {
    if (!this.galleryCache$) {
      this.galleryCache$ = this.http
        .get<GalleryResponse>(
          `${this.apiUrl}/restaurants/${this.getRestaurantId()}/gallery`
        )
        .pipe(
          timeout(this.requestTimeout),
          retry(this.maxRetries),
          map((res) => this.validateResponse<GalleryResponse>(res, ['data'])),
          shareReplay(1),
          catchError(this.handleError(galleryLocal as unknown as GalleryResponse, 'getGalleryData'))
        );
    }
    return this.galleryCache$;
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
    if (!this.combosCache$) {
      this.combosCache$ = this.http
        .get<CombosResponse>(
          `${this.apiUrl}/restaurants/${this.getRestaurantId()}/combos`
        )
        .pipe(
          timeout(this.requestTimeout),
          retry(this.maxRetries),
          map((res) => this.validateResponse<CombosResponse>(res, ['data'])),
          shareReplay(1),
          catchError(this.handleError(combosLocal as unknown as CombosResponse, 'getCombos'))
        );
    }
    return this.combosCache$;
  }

  /**
   * Get all promotions.
   */
  getPromotions(): Observable<{ data: any[] }> {
    if (!this.promotionsCache$) {
      this.promotionsCache$ = this.http
        .get<PromotionsResponse>(
          `${this.apiUrl}/restaurants/${this.getRestaurantId()}/products/promotions`
        )
        .pipe(
          timeout(this.requestTimeout),
          retry(this.maxRetries),
          map((response) => {
            this.validateResponse<PromotionsResponse>(response, ['data']);
            const mappedData = (response.data || []).map((apiPromo: ApiPromotion) => {
              const hasPrices = apiPromo.prices && apiPromo.prices.length > 0;
              const firstPriceEntry = hasPrices ? apiPromo.prices[0] : null;

              // 1. Name preference
              const name = firstPriceEntry?.name || apiPromo.name || "";

              // 2. Description preference
              const description = firstPriceEntry?.description || apiPromo.description || "";

              // 3. Price preference (original price) - usando toNumber seguro
              const basePrice = apiPromo.price
                ? this.toNumber(apiPromo.price)
                : firstPriceEntry?.price
                  ? this.toNumber(firstPriceEntry.price)
                  : 0;

              // 4. Discounted price preference (promotional price) - usando toNumber seguro
              const discountedPrice = firstPriceEntry?.price
                ? this.toNumber(firstPriceEntry.price)
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
          shareReplay(1),
          catchError(this.handleError({
            success: true,
            data: (promotionsLocal.data || []).map((p: any) => ({
              id: String(p.id),
              name: p.name,
              description: p.description,
              price: this.toNumber(p.price),
              discountedPrice: this.toNumber(p.discountedPrice),
              cloudinary_id: p.cloudinary_id || "",
              url: p.url || "/images/combos/combo-1.png",
              prices: [],
              priceRanges: []
            }))
          }, 'getPromotions'))
        );
    }
    return this.promotionsCache$;
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
    if (!this.bannersCache$) {
      this.bannersCache$ = this.http
        .get<BannersResponse>(
          `${this.apiUrl}/restaurants/${this.getRestaurantId()}/banners`
        )
        .pipe(
          timeout(this.requestTimeout),
          retry(this.maxRetries),
          map((res) => {
            if (!res || !res.data || res.data.length === 0) {
              return bannersLocal as unknown as BannersResponse;
            }
            return res;
          }),
          shareReplay(1),
          catchError(this.handleError(bannersLocal as unknown as BannersResponse, 'getBanners'))
        );
    }
    return this.bannersCache$;
  }
}