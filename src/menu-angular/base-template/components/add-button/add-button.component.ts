import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from "@angular/core";
import { LucidePlus } from "@lucide/angular";

@Component({
  selector: "app-add-button",
  standalone: true,
  imports: [LucidePlus],
  template: `
    <button
      (click)="handleClick($event)"
      [disabled]="disabled()"
      class=" bg-accent px-1 py-1 cursor-pointer  text-primary-text  text-2xl  font-display active:scale-95 transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed {{
        customClass()
      }}"
    >
      {{ text() }}
      <svg lucidePlus class="{{ iconSize() }}"></svg>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddButtonComponent {
  // Button text
  text = input<string>("");

  // Additional CSS classes for customization
  customClass = input<string>("");
  disabled = input<boolean>(false);
  iconSize = input<string>("h-6 w-6");

  // Click event
  clicked = output<Event>();

  handleClick(event: Event) {
    event.stopPropagation();
    if (this.disabled()) return;
    this.clicked.emit(event);
  }
}
