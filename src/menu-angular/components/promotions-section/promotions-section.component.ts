import { ChangeDetectionStrategy, Component, computed, inject, type OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../core/services/menu.service';
import { Cart } from '../../core/services/cart.service';
import { RestaurantService } from '../../core/services/restaurant.service';
import { PromotionCardMiniComponent } from '../../base-template/components/promotion-card-mini/promotion-card-mini';
import { LayoutScaleComponent } from '../../layout/layout-scale/layout-scale';

@Component({
  selector: 'app-promotions-section',
  standalone: true,
  imports: [CommonModule, PromotionCardMiniComponent, LayoutScaleComponent],
  template: `
    @if (promotions().length > 0) {
      <div class="w-full py-16 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-background/30 via-background-secondary/20 to-transparent">
        <!-- Background glows -->
        <div class="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Section Title -->
        <div class="max-w-7xl mx-auto mb-12 text-center relative z-10">
          <span class="text-accent font-semibold tracking-widest text-xs uppercase bg-accent/10 px-3 py-1.5 rounded-full">Ofertas Exclusivas</span>
          <h2 class="text-4xl md:text-5xl font-display font-bold text-white mt-4 tracking-tight">
            Nuestras Promociones
          </h2>
          <div class="w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto my-4 rounded-full"></div>
          <p class="text-white/70 max-w-xl mx-auto text-base md:text-lg font-body">
            Aprovecha nuestras ofertas estelares diseñadas especialmente para deleitar tu paladar.
          </p>
        </div>

        <!-- Layout Scale Wrapper containing Cards -->
        <app-layout-scale>
          <!-- Cards Grid -->
          <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            @for (promo of promotions(); track promo.id) {
              <app-promotion-card-mini 
                [promotion]="promo" 
                (addToCart)="onAddToCart($event)"
                (productClick)="onProductClick($event)">
              </app-promotion-card-mini>
            }
          </div>
        </app-layout-scale>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionsSectionComponent implements OnInit {
  readonly promotions = signal<any[]>([]);

  private readonly menuService = inject(MenuService);
  private readonly cartService = inject(Cart);
  private readonly restaurantService = inject(RestaurantService);
  
  readonly canOrder = computed(() => this.restaurantService.orderConfig()?.delivery_enabled ?? true);

  ngOnInit(): void {
    this.menuService.getPromotions().subscribe((res) => {
      if (res?.data) {
        this.promotions.set(res.data);
      }
    });
  }

  onAddToCart(item: any): void {
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
    this.cartService.addItem(normalizedProduct, 1);
    this.cartService.open();
  }

  onProductClick(product: any): void {
    if (this.canOrder()) {
      this.onAddToCart(product);
    }
  }
}
