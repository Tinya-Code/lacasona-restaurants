import { Component, inject, signal, computed } from "@angular/core";
import { MenuService } from "../../core/services/menu.service";
import { RestaurantService } from "../../core/services/restaurant.service";
import type { Block } from "../../core/models/block.model";
import { CommonModule } from "@angular/common";
import type { OnInit } from "@angular/core";
// UI Components
import { SidebarCart } from "../../components/sidebar-cart/sidebar-cart.component";
import { CartTriggerComponent } from "../../components/cart-trigger/cart-trigger.component";
import { RestaurantClosedModalComponent } from "../../components/restaurant-closed-modal/restaurant-closed-modal.component";
import { CategoryNav } from "../../components/category-nav/category-nav.component";
import { ChifaProductDetail } from "../../base-template/components/product-detail/product-detail";
import { BaseTemplate } from "../../base-template";
import { WhatsAppButton } from "../../components/whatsapp-button/whatsapp-button.component";
import { LoadingScreenComponent } from "../../components/loading-screen/loading-screen.component";
import { forkJoin } from "rxjs";
import { finalize } from "rxjs/operators";

// Services
import { Cart } from "../../core/services/cart.service";
import { BusinessHoursService } from "../../core/services/business-hours.service";

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [
    CommonModule,
    BaseTemplate,
    SidebarCart,
    CartTriggerComponent,
    RestaurantClosedModalComponent,
    CategoryNav,
    ChifaProductDetail,
    WhatsAppButton,
    LoadingScreenComponent,
  ],
  templateUrl: "./menu.html",
})
export class Menu implements OnInit {
  private readonly menuService = inject(MenuService);
  private readonly restaurantService = inject(RestaurantService);
  private readonly _cart = inject(Cart);
  private readonly _businessHours = inject(BusinessHoursService);

  // UI State
  readonly isLoading = signal(false);
  readonly selectedProduct = signal<any | null>(null);
  readonly isOffline = signal(false);

  // Data signals
  readonly blocks = signal<Block[]>([]);
  readonly combos = signal<any[]>([]);
  readonly promotions = signal<any[]>([]);

  readonly allCategories = computed(() => {
    return this.blocks().flatMap((block) =>
      block.categories.map((cat) => ({ category: cat })),
    );
  });

  // Service exposure
  readonly isCartOpen = this._cart.isOpen;
  readonly isRestaurantClosed = this._cart.isBusinessClosed;
  readonly businessHours = this._businessHours.rawHours;

  ngOnInit() {
    this.isLoading.set(true);
    this.isOffline.set(false);

    // We wait for the main data sources to be ready
    forkJoin({
      menu: this.menuService.getMenuData(),
      combos: this.menuService.getCombos(),
      promotions: this.menuService.getPromotions(),
    }).pipe(
      finalize(() => {
        this.isLoading.set(false);
        this.isOffline.set(!this.menuService.getConnectionStatus());
      })
    ).subscribe(({ menu, combos, promotions }) => {
      // 1. Process Menu Data
      if (menu?.data?.blocks) {
        const normalizedBlocks = menu.data.blocks.map((block: any) => ({
          ...block,
          categories: (block.categories || []).map((cat: any) => ({
            ...cat,
            products: cat.products || [],
          })),
        }));
        this.blocks.set(normalizedBlocks);
      }

      // 2. Process Combos
      if (combos?.data) {
        this.combos.set(combos.data);
      }

      // 3. Process Promotions
      if (promotions?.data) {
        this.promotions.set(promotions.data);
      }

      // Give it a tiny extra delay for the animations to feel smooth
      setTimeout(() => {
        this.isLoading.set(false);
      }, 300);
    });
  }


  onProductClick(product: any): void {
    this.selectedProduct.set(product);
  }

  onAddToCart(item: any, quantity: number = 1, selectedEntry?: any): void {
    const normalizedProduct: any = {
      id: Number(item.id) || item.id,
      name: item.name,
      description: item.description || "",
      price: String(item.discountedPrice !== undefined ? item.discountedPrice : item.price),
      imageUrl: item.imageUrl || item.image_url || item.url || "",
      categoryId: item.categoryId || item.category_id || "item",
      isActive: true,
      isRecommended: false,
      prices: item.prices || [],
      priceRanges: item.priceRanges || [],
    };
    this._cart.addItem(normalizedProduct, quantity, selectedEntry);
  }

  closeProductDetail(): void {
    this.selectedProduct.set(null);
  }

  closeClosedModal(): void {
    this._cart.closeBusinessClosedModal();
  }
}
