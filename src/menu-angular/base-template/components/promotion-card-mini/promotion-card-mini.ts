import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { PrecioPipe } from '../../../core/pipes/precio.pipe';
import { AddButtonComponent } from '../add-button/add-button.component';
import { RestaurantService } from '../../../core/services/restaurant.service';
import type { Product } from '../../../core/models/product.model';
import type { Promotion } from '../../../core/models/menu.model';

@Component({
  selector: 'app-promotion-card-mini',
  standalone: true,
  imports: [CommonModule, NgClass, PrecioPipe, AddButtonComponent],
  template: `
    <div 
      (click)="onCardClick()"
      class="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 rounded-xl p-3 w-full transition-all duration-300 cursor-pointer active:scale-98"
    >
      <!-- Mini Image -->
      <div class="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-secondary/50">
        <img 
          [src]="promotion().url" 
          [alt]="promotion().name"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          (error)="onImgError($event)"
        />
        <div class="absolute inset-0 bg-black/10"></div>
      </div>

      <!-- Center Content -->
      <div class="flex-1 min-w-0 flex flex-col gap-1">
        <div class="flex items-baseline justify-between gap-2">
          <h4 class="text-base font-display font-semibold text-white truncate group-hover:text-accent transition-colors duration-300">
            {{ promotion().name }}
          </h4>
        </div>
        <p class="text-xs text-white/60 font-body line-clamp-1">
          {{ promotion().description }}
        </p>

        <!-- Prices row -->
        <div class="flex items-center gap-2 mt-1">
          <span class="text-sm font-display font-bold text-accent">
            {{ promotion().discountedPrice | precio }}
          </span>
          @if (promotion().price > promotion().discountedPrice) {
            <span class="text-xs font-body text-white/40 line-through">
              {{ promotion().price | precio }}
            </span>
          }
        </div>
      </div>

      <!-- Action Button -->
      @if (canOrder()) {
        <div class="shrink-0 relative z-20">
          <button 
            (click)="onAddClick($event)"
            class="w-8 h-8 flex items-center justify-center bg-accent hover:bg-accent/90 active:scale-90 rounded-lg text-black transition-all duration-200"
            title="Agregar al carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionCardMiniComponent {
  promotion = input.required<Promotion>();
  addToCart = output<Promotion>();
  productClick = output<Product>();

  private readonly restaurantService = inject(RestaurantService);
  readonly canOrder = computed(() => this.restaurantService.orderConfig()?.delivery_enabled ?? true);

  onCardClick() {
    const promo = this.promotion();
    const product: Product = {
      id: Number(promo.id) || 0,
      name: promo.name,
      description: promo.description,
      price: String(promo.discountedPrice),
      imageUrl: promo.url,
      categoryId: promo.category_id || 'promotion',
      isActive: true,
      isRecommended: false,
      prices: promo.prices || [],
      priceRanges: promo.priceRanges || []
    };
    this.productClick.emit(product);
  }

  onAddClick(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.promotion());
  }

  onImgError(event: any) {
    event.target.src = '/images/combos/combo-1.png';
  }
}
