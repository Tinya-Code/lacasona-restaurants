import { Component, inject, computed, signal } from '@angular/core';

import { RestaurantService } from '../../core/services/restaurant.service';


@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [],
  templateUrl: './whatsapp-button.component.html',
})
export class WhatsAppButton {
  private readonly restaurantService = inject(RestaurantService);

  readonly phoneNumber = computed(() => this.restaurantService.whatsappConfig()?.number || '');

  readonly message = computed(
    () =>
      this.restaurantService.whatsappConfig()?.message_template || 'Hola, me gustaría información',
  );

  readonly whatsappUrl = computed(
    () => `https://wa.me/${this.phoneNumber()}?text=${encodeURIComponent(this.message())}`,
  );

  showTooltip = signal(false);

  ngOnInit() {
    // Mostrar el tooltip automáticamente después de 3 segundos
    setTimeout(() => {
      this.showTooltip.set(true);
      // Ocultar después de otros 5 segundos
      setTimeout(() => this.showTooltip.set(false), 8000);
    }, 3000);
  }
}
