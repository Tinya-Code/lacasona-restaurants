import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import  { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  isOpen = input.required<boolean>();
  title = input<string>('');
  close = output<void>();

  onClose(): void {
    this.close.emit();
  }
}
