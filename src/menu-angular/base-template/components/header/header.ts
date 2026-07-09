import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ShareButtonComponent } from "../../../components/share-button/share-button.component";
import { RestaurantService } from "../../../core/services/restaurant.service";
import {
  LucideMapPin,
  LucideMap,
  LucideCopy,
  LucideUtensils,
  LucideImages,
} from "@lucide/angular";

@Component({
  selector: "app-template-header",
  standalone: true,
  imports: [
    ShareButtonComponent,
    LucideMapPin,
    LucideCopy,
    LucideMap,
    LucideImages,
  ],
  template: `
    <header
      class="relative font-body bg-secondary border-b-8 border-primary px-6 py-12 mb-12 rounded-b-[100px] overflow-hidden"
    >
      <div
        class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 items-center justify-center space-y-8 relative z-10"
      >
        <!-- Logo Section -->
        <a routerLink="/" class="relative group col-span-3  cursor-pointer ">
          <img
            src="/logo-borde-lacasona.svg"
            alt="Logo"
            class="w-full max-h-64 h-auto "
          />
        </a>

        <!-- Info Section -->
        <div class="text-center  md:text-left gap-4 col-span-2 items-center justify-center flex flex-col space-y-4">
          <div
            class="flex flex-wrap items-center justify-center md:justify-start "
          >
            <div
              class="group flex items-center gap-3  px-3 py-2 rounded-full border-2 border-primary transition-colors duration-300"
            >
              <!-- Badge del pin -->

                <svg lucideMapPin class="w-6 h-6 text-primary-text"></svg>
       

              <!-- Dirección -->
              <span
                class="text-lg font-semibold text-primary-text/90 tracking-tight max-w-[220px] truncate"
              >
                {{ address() }}
              </span>

              <!-- Acciones -->
              <div
                class="flex items-center gap-1 border-l border-primary/20 pl-3 ml-1"
              >
                <button
                  (click)="copyAddress()"
                  title="Copiar dirección"
                  class="flex items-center justify-center w-8 h-8 rounded-full text-primary-text/60 hover:text-primary hover:bg-primary/10 transition-all duration-200 active:scale-90"
                >
                  <svg lucideCopy class="w-6 h-6"></svg>
                </button>
                <button
                  (click)="openMaps()"
                  title="Ver en Google Maps"
                  class="flex items-center justify-center w-8 h-8 rounded-full text-primary-text/60 hover:text-primary hover:bg-primary/10 transition-all duration-200 active:scale-90"
                >
                  <svg lucideMap class="w-6 h-6"></svg>
                </button>
              </div>
            </div>
          </div>
          <!-- Action Section -->
          <div class="flex md:flex-col lg:flex-row justify-center items-center gap-4">
            <!-- Gallery Button -->

            <a
              routerLink="/gallery"
              class="group flex rounded-full hover:border-transparent border-2  gap-2 px-4 py-2 border-primary/80 hover:bg-primary items-center "
            >
              <svg
                lucideImages
                class="w-6 h-6 text-white group-hover:scale-110 transition-transform"
              ></svg>

              <span
                class="text-lg text-white uppercase tracking-widest font-display transition-colors"
                >Galería</span
              >
            </a>
            <!-- Share Button -->

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
