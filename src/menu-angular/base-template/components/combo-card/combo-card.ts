import { ChangeDetectionStrategy, Component, input, output, computed, inject } from '@angular/core';
import { type Combo } from '../../../core/models/menu.model';
import { PrecioPipe } from '../../../core/pipes/precio.pipe';
import { AddButtonComponent } from '../add-button/add-button.component';
import { RestaurantService } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-combo-card',
  standalone: true,
  imports: [PrecioPipe, AddButtonComponent],
  templateUrl: './combo-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboCardComponent {
  combo = input.required<Combo>();
  addToCart = output<Combo>();

  private readonly restaurantService = inject(RestaurantService);
  readonly canOrder = computed(() => this.restaurantService.orderConfig()?.delivery_enabled ?? true);
}
