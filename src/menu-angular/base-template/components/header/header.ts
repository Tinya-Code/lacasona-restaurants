import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ShareButtonComponent } from "../../../components/share-button/share-button.component";
import { RestaurantService } from "../../../core/services/restaurant.service";
import { LucideMapPin, LucideMap, LucideCopy, LucideUtensils, LucideImages } from "@lucide/angular";

@Component({
  selector: "app-template-header",
  standalone: true,
  imports: [ShareButtonComponent, LucideMapPin, LucideCopy, LucideMap, LucideUtensils, LucideImages],
  template: `
    <header
      class="relative font-body bg-secondary border-b-8 border-primary px-6 pt-12 pb-16 mb-12 rounded-b-[100px] overflow-hidden"
    >
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10">
        <!-- Logo Section -->
        <a routerLink="/" class="relative group cursor-pointer">
          <div
            class="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          ></div>
          <div
            class="w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(220,38,38,0.3)] transform -rotate-6 group-hover:rotate-0 transition-all duration-700 ease-out"
          >
            <svg lucideUtensils class="w-16 h-16 text-white"></svg>
          </div>
        </a>

        <!-- Info Section -->
        <div class="text-center md:text-left flex-1 space-y-4">
          <h1 class="text-6xl md:text-8xl font-display text-white leading-none tracking-tighter">
            {{ restaurantName() }}<span class="text-primary">.</span>
          </h1>

          <div class="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div
              class="flex items-center gap-2 text-primary-text/80 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20"
            >
              <svg lucideMapPin class="w-4 h-4 text-primary"></svg>
              <span class="text-xs font-bold uppercase tracking-wider mr-2">{{ address() }}</span>
              
              <div class="flex items-center gap-3 border-l border-primary/20 pl-4 py-1">
             
              <button
                  (click)="copyAddress()"
                  title="Copiar dirección"
                  class="hover:text-primary transition-colors hover:scale-110"
                >
                  <svg lucideCopy  class="w-4 h-4"></svg>
                </button>
                <button
                  (click)="openMaps()"
                  title="Ver en Google Maps"
                  class="hover:text-primary transition-colors hover:scale-110"
                >
                  <svg lucideMap class="w-4 h-4"></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Section -->
        <div class="flex flex-row md:flex-col items-start gap-4">
          <!-- Gallery Button -->
           <a
            routerLink="/menu"
            routerLinkActive="hidden"
            class="group flex rounded-sm hover:border-transparent border-2 gap-2 px-4 py-2 border-primary/80 hover:bg-primary items-center "
          >
            <svg lucideUtensils
              class="w-4 h-4 text-white group-hover:scale-110 transition-transform"
            ></svg>

            <span
              class="text-lg text-white uppercase tracking-widest font-display transition-colors"
              >Menu</span
            >
          </a>
          <a
            routerLink="/gallery"
            class="group flex rounded-sm hover:border-transparent border-2 gap-2 px-4 py-2 border-primary/80 hover:bg-primary items-center "
          >
            <svg lucideImages
              class="w-4 h-4 text-white group-hover:scale-110 transition-transform"
            ></svg>

            <span
              class="text-lg text-white uppercase tracking-widest font-display transition-colors"
              >Galería</span
            >
          </a>

          <!-- Share Button -->
          <div class="flex flex-col items-center gap-2">
            <app-share-button />
          </div>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateHeader {
  readonly _restaurantService = inject(RestaurantService);
  private readonly router = inject(Router, { optional: true });
  private readonly route = inject(ActivatedRoute, { optional: true });

  readonly restaurantName = computed(
    () => this._restaurantService.restaurant()?.name ?? "Mr Sushi",
  );
  readonly description = computed(
    () => this._restaurantService.settings()?.description ?? "",
  );
  readonly address = computed(
    () => this._restaurantService.restaurant()?.address ?? "",
  );
  readonly location = computed(
    () => this._restaurantService.restaurant()?.location,
  );

  copyAddress() {
    navigator.clipboard.writeText(this.address());
  }

  openMaps() {
    const loc = this.location();
    let url = "";

    if (loc && loc.lat && loc.lng) {
      url = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.address())}`;
    }

    window.open(url, "_blank");
  }
}
