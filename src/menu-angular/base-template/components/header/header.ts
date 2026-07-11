import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import {
  LucideCopy,
  LucideImages,
  LucideMap,
  LucideMapPin,
} from "@lucide/angular";
import { ShareButtonComponent } from "../../../components/share-button/share-button.component";
import { RestaurantService } from "../../../core/services/restaurant.service";

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
  templateUrl: "./header.html",
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
