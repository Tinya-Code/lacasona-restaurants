import { ChangeDetectionStrategy, Component, input, ElementRef, ViewChild } from '@angular/core';
import type { AfterViewInit } from '@angular/core';

import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
  
@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [LucideChevronLeft, LucideChevronRight],
  templateUrl: './slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements AfterViewInit {
  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLElement>;
  
  showArrows = input<boolean>(true);
  autoSlide = input<boolean>(false);
  autoSlideInterval = input<number>(5000);

  scrollPosition = 0;
  private intervalId: any;

  ngAfterViewInit() {
    if (this.autoSlide()) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  next() {
    const container = this.sliderContainer.nativeElement;
    const scrollAmount = container.clientWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  prev() {
    const container = this.sliderContainer.nativeElement;
    const scrollAmount = container.clientWidth;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  private startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.next();
    }, this.autoSlideInterval());
  }
}
