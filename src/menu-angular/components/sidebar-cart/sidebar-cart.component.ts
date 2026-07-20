import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cart } from "../../core/services/cart.service";
import { PrecioPipe } from "../../core/pipes/precio.pipe";
import { CartItemComponent } from "../cart-item/cart-item.component";
import { CheckoutFormComponent } from "../checkout-form/checkout-form.component";
import { BusinessHoursService } from "../../core/services/business-hours.service";
import { LucideArrowRight, LucideShoppingBag, LucideArrowLeft, LucideX, LucideMapPin } from "@lucide/angular";
import type { DeliveryZone } from "../../core/models/restaurant.model";

@Component({
  selector: "app-sidebar-cart",
  standalone: true,
  imports: [
    CommonModule,
    PrecioPipe,
    CartItemComponent,
    CheckoutFormComponent,
    LucideArrowRight,
    LucideShoppingBag,
    LucideArrowLeft,
    LucideX,
    LucideMapPin
  ],
  templateUrl: "./sidebar-cart.component.html",
  styles: `
    .rotate-90 {
      transform: rotate(90deg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarCart {
  templateId = input<string | null>();
  backgroundColor = input<string | null>();

  private readonly _cart = inject(Cart);
  private readonly _businessHours = inject(BusinessHoursService);

  // UI State
  showCheckout = signal(false);
  showDeliveryZones = signal(false);

  // Exposición de signals del servicio Cart
  readonly isOpen = this._cart.isOpen;
  readonly items = this._cart.items;
  readonly count = this._cart.count;
  readonly subtotal = this._cart.subtotal;
  readonly deliveryFee = this._cart.deliveryFee;
  readonly total = this._cart.total;
  readonly isEmpty = this._cart.isEmpty;
  readonly isRestaurandClosed = this._cart.isBusinessClosed;
  readonly deliveryZones = this._cart.deliveryZones;
  readonly selectedDeliveryZone = this._cart.selectedDeliveryZone;

  // Horarios
  readonly businessHours = this._businessHours.hours;

  /**
   * Cierra el carrito.
   */
  close(): void {
    this._cart.close();
    this.showCheckout.set(false);
  }

  /**
   * Procede al checkout.
   */
  checkout(): void {
    if (!this._businessHours.isOpen()) {
      this._cart.showBusinessClosedModal();
      return;
    }
    this.showCheckout.set(true);
  }

  /**
   * Regresa a la vista del carrito.
   */
  backToCart(): void {
    this.showCheckout.set(false);
  }

  /**
   * Acciones del carrito delegadas al servicio.
   */
  increaseItem(productId: string): void {
    const item = this.items().find((i) => i.id === productId);
    if (item) this._cart.updateQuantity(productId, item.quantity + 1);
  }

  decreaseItem(productId: string): void {
    const item = this.items().find((i) => i.id === productId);
    if (item) this._cart.updateQuantity(productId, item.quantity - 1);
  }

  removeItem(productId: string): void {
    this._cart.removeItem(productId);
  }

  clear(): void {
    this._cart.clear();
  }

  /**
   * Cierra el modal de restaurante cerrado.
   */
  closeClosedModal(): void {
    this._cart.closeBusinessClosedModal();
  }

  /**
   * Selecciona una zona de entrega.
   */
  selectDeliveryZone(zone: DeliveryZone): void {
    this._cart.selectDeliveryZone(zone);
    this.showDeliveryZones.set(false);
  }

  /**
   * Abre/cierra el selector de zonas de entrega.
   */
  toggleDeliveryZones(): void {
    this.showDeliveryZones.set(!this.showDeliveryZones());
  }

  /**
   * Cierra el selector de zonas de entrega.
   */
  closeDeliveryZones(): void {
    this.showDeliveryZones.set(false);
  }
}
