import { ChangeDetectionStrategy, Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { MenuService } from '../../core/services/menu.service';
import { ModalComponent } from '../modal/modal.component';
import type { Banner } from '../../core/models/banner.model';
import type { OnInit } from '@angular/core';
@Component({
  selector: 'app-banners-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './banners-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannersModalComponent implements OnInit {
  private readonly menuService = inject(MenuService);
  private readonly platformId = inject(PLATFORM_ID);


  readonly isOpen = signal<boolean>(false);
readonly banners = signal<Banner[]>([]);
readonly selectedIndex = signal<number>(0);

ngOnInit(): void {
  if (!isPlatformBrowser(this.platformId)) return;
  if (sessionStorage.getItem('banners_shown')) return;

  this.menuService.getBanners().subscribe({
    next: (response) => {
      if (response?.data?.length > 0) {
        this.banners.set(response.data);
        this.selectedIndex.set(0);
        this.isOpen.set(true);
        sessionStorage.setItem('banners_shown', 'true');
      }
    }
  });
}

get selectedBanner(): Banner | null {
  const arr = this.banners();
  const idx = this.selectedIndex();
  return arr[idx] ?? null;
}

onClose(): void {



 const next = this.selectedIndex() + 1;
 if (next < this.banners().length) {
   this.selectedIndex.set(next);
 } else {
    this.isOpen.set(false);
 }
}

}
