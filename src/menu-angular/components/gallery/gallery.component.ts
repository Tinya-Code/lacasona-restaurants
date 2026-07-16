import { ChangeDetectionStrategy, Component, inject, input, type OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../core/services/menu.service';
import type { GalleryItem } from '../../core/models/menu.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnInit {
  private readonly menuService = inject(MenuService);

  // Inputs para personalizar el encabezado
  heading = input<string>('La Casona');
  description = input<string>(
    'Un recorrido visual por nuestros platos, el ambiente acogedor y los momentos que hacen única tu experiencia en Manchay.'
  );

  // Signals para manejar el estado
  readonly items = signal<GalleryItem[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadGallery();
  }

  private loadGallery(): void {
    this.loading.set(true);
    this.menuService.getGalleryData().subscribe({
      next: (response) => {
        if (response && response.success && Array.isArray(response.data)) {
          this.items.set(response.data);
        } else {
          this.items.set([]);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading gallery data', err);
        this.error.set('No se pudo cargar la galería de imágenes.');
        this.loading.set(false);
      }
    });
  }
}
