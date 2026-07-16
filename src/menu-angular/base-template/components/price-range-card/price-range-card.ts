import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideStar } from "@lucide/angular";
import type { Product } from "../../../core/models/product.model";
import { PrecioPipe } from "../../../core/pipes/precio.pipe";

@Component({
  selector: "app-price-range-card",
  standalone: true,
  imports: [PrecioPipe, CommonModule, LucideStar],
  template: `
    <div
      (click)="productClick.emit(product())"
      class="group relative p-4 justify-between items-center transition-all duration-300 overflow-hidden cursor-pointer bg-primary text-white rounded-b-xl rounded-t-[120px] flex flex-col h-full"
    >
      <!-- Image (Side position) -->
      <div
        class="relative flex rounded-full h-40 w-40 bg-secondary justify-center"
      >
        @if (product().imageUrl) {
          <img
            [src]="product().imageUrl"
            class="w-full h-auto object-contain drop-shadow-2xl transform group-hover:-translate-x-4 transition-transform duration-700"
            alt="{{ product().name }}"
          />
        }
      </div>

      <!-- Title & Badge -->
      <div class="relative flex flex-col w-full pt-4">
        <h3
          class="text-4xl flex items-start justify-between gap-2 font-display text-white tracking-tight transition-colors"
        >
          {{ product().name }}
          @if (product().isRecommended) {
            <svg
              lucideStar
              class="w-5 h-5 drop-shadow-xs drop-shadow-amber-600 text-accent fill-accent"
            ></svg>
          }
        </h3>
      </div>

      <!-- Bottom: Info & Selection Action -->
      <div class="mt-auto w-full relative flex flex-col justify-between">
        <div class="flex flex-col">
          <span
            class="text-xs font-body font-bold uppercase tracking-[0.2em] text-white/70"
          >
            Desde
          </span>
          <span class="text-3xl font-display text-accent tracking-tighter">
            {{ startingPrice() | precio }}
          </span>
        </div>

        @if (canOrder()) {
          <div
            class="flex justify-between w-full items-center gap-2 px-4 py-2 border-2 border-accent group-hover:bg-accent transition-colors"
          >
            <span class="text-xs font-body font-bold uppercase tracking-widest">
              Elegir cantidades
            </span>
            <svg lucidePlus class="w-4 h-4 font-bold"></svg>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceRangeCard {
  product = input.required<Product>();
  startingPrice = input<number | null>();
  canOrder = input<boolean>();

  productClick = output<Product>();
  addToCart = output<Product>();
}
