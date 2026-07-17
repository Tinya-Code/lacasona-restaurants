import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrecioPipe } from "../../../core/pipes/precio.pipe";
import { RestaurantService } from "../../../core/services/restaurant.service";
import type { Product } from "../../../core/models/product.model";
import type { Promotion } from "../../../core/models/menu.model";

@Component({
  selector: "app-promotion-card-mini",
  standalone: true,
  imports: [CommonModule, PrecioPipe],
  template: `
    <a
      href="/menu-la-casona-manchay/#promotions"
      class="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 rounded-xl p-3 w-full transition-all duration-300 cursor-pointer active:scale-98"
    >
      <!-- Mini Image -->
      <div
        class="relative w-30 h-30   "
      >
        <img
          [src]="promotion().url"
          [alt]="promotion().name"
          class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <!-- Center Content -->
      <div class="flex-1 min-w-0 flex flex-col gap-1">
        <div class="flex items-baseline justify-between gap-2">
          <h4
            class="text-2xl font-display font-semibold text-white truncate group-hover:text-accent transition-colors duration-300"
          >
            {{ promotion().name }}
          </h4>
        </div>
        <p class=" text-white/60 font-body line-clamp-3">
          {{ promotion().description }}
        </p>

        <div class="flex items-center gap-2 mt-1">
                @if (promotion().price > promotion().discountedPrice) {
            <span class="text-xl font-body text-white/40 line-through">
              {{ promotion().price | precio }}
            </span>
          }
          <span class="text-2xl font-display font-bold text-accent">
            {{ promotion().discountedPrice | precio }}
          </span>
    
        </div>
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionCardMiniComponent {
  promotion = input.required<Promotion>();
  addToCart = output<Promotion>();
  productClick = output<Product>();

  private readonly restaurantService = inject(RestaurantService);
  readonly canOrder = computed(
    () => this.restaurantService.orderConfig()?.delivery_enabled ?? true,
  );

  onAddClick(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.promotion());
  }
}
