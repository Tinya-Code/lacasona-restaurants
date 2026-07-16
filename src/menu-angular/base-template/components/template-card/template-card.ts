import { ChangeDetectionStrategy, Component, input, output, inject, computed } from '@angular/core';
import { LucideStar } from '@lucide/angular';
import type { Product } from '../../../core/models/product.model';
import { PrecioPipe } from '../../../core/pipes/precio.pipe';
import { AddButtonComponent } from '../add-button/add-button.component';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { CommonModule } from '@angular/common';
import { PriceRangeCard } from '../price-range-card/price-range-card';

@Component({
  selector: 'app-template-card',
  standalone: true,
  imports: [PrecioPipe, AddButtonComponent, CommonModule, LucideStar, PriceRangeCard],
  templateUrl: './template-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateCardComponent {
  product = input.required<Product>();
  productClick = output<Product>();
  addToCart = output<Product>();

  private readonly restaurantService = inject(RestaurantService);

  readonly canOrder = computed(() => this.restaurantService.orderConfig()?.delivery_enabled ?? true);

  /** True if the product has embedded price ranges from the API. */
  readonly hasPriceRange = computed(() => {
    const ranges = this.product().priceRanges;
    return Array.isArray(ranges) && ranges.length > 0;
  });

  /** Minimum price from embedded ranges, or flat product price. */
  readonly startingPrice = computed<number | null>(() => {
    const ranges = this.product().priceRanges;
    if (ranges && ranges.length > 0) {
      const prices = ranges
        .map(r => Number(r.price))
        .filter(n => !isNaN(n) && n > 0);
      return prices.length > 0 ? Math.min(...prices) : null;
    }
    const p = this.product().price;
    if (p === '' || p === null || p === undefined) return null;
    const n = Number(p);
    return isNaN(n) ? null : n;
  });

  onAddClick(event: Event) {
    event.stopPropagation();
    if (this.hasPriceRange()) {
      // Must open detail modal so user can pick a range
      this.productClick.emit(this.product());
    } else {
      this.addToCart.emit(this.product());
    }
  }
}
