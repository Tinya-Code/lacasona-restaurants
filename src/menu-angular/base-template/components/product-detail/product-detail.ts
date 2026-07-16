import { ChangeDetectionStrategy, Component, input, output, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideShoppingBag, LucidePlus, LucideMinus, LucideX, LucideMessageCircle } from '@lucide/angular';
import type { Product } from '../../../core/models/product.model';
import type { PriceRangeEntry } from '../../../core/models/price-range.model';
import { PrecioPipe } from '../../../core/pipes/precio.pipe';
import { DataStoreService } from '../../../core/services/data-store.service';
import { RestaurantService } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-chifa-product-detail',
  standalone: true,
  imports: [PrecioPipe, CommonModule, LucideShoppingBag, LucideMessageCircle, LucideX, LucidePlus, LucideMinus],
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChifaProductDetail {
  product = input.required<Product>();
  addToCart = output<{ product: Product; quantity: number; selectedEntry?: PriceRangeEntry }>();
  close = output<void>();

  private readonly dataStore = inject(DataStoreService);
  private readonly restaurantService = inject(RestaurantService);

  readonly maxQuantity = computed(() => this.restaurantService.orderConfig()?.max_order_quantity ?? 99);
  readonly canOrder = computed(() => this.restaurantService.orderConfig()?.delivery_enabled ?? true);

  // UI Icons
  ShoppingBag = LucideShoppingBag;
  Plus = LucidePlus;
  Minus = LucideMinus;
  X = LucideX;
  MessageCircle = LucideMessageCircle;

  quantity = signal(1);
  private readonly _selectedEntry = signal<PriceRangeEntry | null>(null);

  /** Embedded price ranges from the product (API response). */
  readonly priceRanges = computed(() => this.product().priceRanges ?? []);

  /** True if the product has price range options. */
  readonly hasPriceRanges = computed(() => this.priceRanges().length > 0);

  /** The effectively selected entry. Defaults to the first entry. */
  readonly selectedEntry = computed(() => {
    const manual = this._selectedEntry();
    if (manual) return manual;
    const ranges = this.priceRanges();
    return ranges.length > 0 ? ranges[0] : null;
  });

  readonly currentPrice = computed(() => {
    const entry = this.selectedEntry();
    if (entry) return Number(entry.price);
    const raw = this.product().price;
    if (raw === null || raw === undefined || raw === '') return 0;
    const parsed = Number(raw);
    return isNaN(parsed) ? 0 : parsed;
  });

  increase() {
    if (this.quantity() < this.maxQuantity()) this.quantity.update(q => q + 1);
  }

  decrease() {
    if (this.quantity() > 1) this.quantity.update(q => q - 1);
  }

  selectEntry(entry: PriceRangeEntry) {
    this._selectedEntry.set(entry);
  }

  onAddToCart() {
    this.addToCart.emit({
      product: this.product(),
      quantity: this.quantity(),
      selectedEntry: this.selectedEntry() ?? undefined,
    });
    this.close.emit();
  }

  orderViaWhatsApp() {
    const settings = this.dataStore.activeSettings();
    const phone = settings?.whatsapp_config?.number;
    if (!phone) return;

    let message = `Hola, quisiera pedir ${this.quantity()}x ${this.product().name}`;

    const entry = this.selectedEntry();
    if (entry) {
      message += ` (${entry.quantity} ${entry.unit} - S/ ${entry.price})`;
      if (entry.bonus) message += ` + ${entry.bonus}`;
    }

    message += ` del menú.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
