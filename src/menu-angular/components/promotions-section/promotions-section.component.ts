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
      <section class="w-full py-16 px-4 min-h-80  bg-secondary bg-blend-color-burn bg-[url('/bg-patern_1.webp')] ">

        <div class="max-w-7xl mx-auto mb-12 text-center relative z-10">
          <span class="text-accent  text-xs  bg-accent/10 px-3 py-1.5 rounded-full">Ofertas Exclusivas</span>
          <h2 class="text-4xl md:text-5xl font-display font-bold text-primary-text mt-4 tracking-tight">
            Nuestras Promociones Mensuales 
          </h2>
 
        </div>


          <!-- Cards Grid -->
          <div class="w-full border  mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  ">
            @for (promo of promotions(); track promo.id) {
              <app-promotion-card-mini 
                [promotion]="promo" 
                (addToCart)="onAddToCart($event)"
                (productClick)="onProductClick($event)">
              </app-promotion-card-mini>
            }
          </div>

      </section>
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
