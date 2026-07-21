import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RestaurantContextService {
  private restaurantId = signal<string>('00000000-0000-0000-0000-000000000001');

  setRestaurant(id: string): void {
    this.restaurantId.set(id);
  }

  getRestaurantId(): string {
    return this.restaurantId();
  }

  getRestaurantIdSignal() {
    return this.restaurantId;
  }
}