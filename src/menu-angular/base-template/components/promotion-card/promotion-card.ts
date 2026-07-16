import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { PrecioPipe } from '../../../core/pipes/precio.pipe';
import { AddButtonComponent } from '../add-button/add-button.component';
import type { Product } from '../../../core/models/product.model';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { computed, inject } from '@angular/core';

export interface Promotion {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  cloudinary_id: string;
  url: string;
}

@Component({
  selector: 'app-promotion-card',
  standalone: true,
  imports: [ PrecioPipe, AddButtonComponent, NgClass],
  templateUrl: './promotion-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionCardComponent {
  promotion = input.required<Promotion>();
  addToCart = output<Promotion>();
  productClick = output<Product>();

  private readonly restaurantService = inject(RestaurantService);

  readonly canOrder = computed(() => this.restaurantService.orderConfig()?.delivery_enabled ?? true);

  showMore = signal(false);

  toggleShowMore(event: Event): void {
    event.stopPropagation();
    this.showMore.set(!this.showMore());
  }

  onCardClick() {
    const promo = this.promotion();
    const product: Product = {
      id: Number(promo.id) || 0,
      name: promo.name,
      description: promo.description,
      price: String(promo.discountedPrice), // Show the discounted price as the main price
      imageUrl: promo.url,
      categoryId: 'promotion',
      isActive: true,
      isRecommended: false,
      prices: [],
      priceRanges: []
    };
    this.productClick.emit(product);
  }

  onAddClick(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.promotion());
  }
}
