import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { TimeFormatPipe } from '../../../core/pipes/time-format.pipe';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { BusinessHoursService } from '../../../core/services/business-hours.service';
import { LucideArrowUpRight, LucidePhone } from "@lucide/angular";
@Component({
  selector: 'app-template-footer',
  standalone: true,
  imports: [TimeFormatPipe, LucideArrowUpRight, LucidePhone],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateFooter {
  private readonly _restaurantService = inject(RestaurantService);
  private readonly _businessHours = inject(BusinessHoursService);

  readonly restaurantName = computed(() => this._restaurantService.restaurant()?.name ?? 'TU RESTAURANTE');
  readonly restaurantDescription = computed(() => this._restaurantService.settings()?.description ?? '');
  readonly restaurantPhone = computed(() => this._restaurantService.restaurant()?.phone ?? '');
  
  readonly socialMedia = this._restaurantService.socialMedia;
  readonly socialMediaSafe = computed(() => this.socialMedia() as any);
  
  readonly todayHours = computed(() => {
    const hours = this._businessHours.rawHours();
    if (!hours) return null;
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return (hours as any)[today];
  });
}
