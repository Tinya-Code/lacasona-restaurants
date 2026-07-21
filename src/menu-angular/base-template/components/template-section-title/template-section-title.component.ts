import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LucideWavesHorizontal } from "@lucide/angular";

@Component({
  selector: "app-template-section-title",
  standalone: true,
  imports: [ LucideWavesHorizontal],
  template: `
    <div
      class="flex flex-col  items-center justify-center z-10 gap-2 md:gap-4 mb-8"
    >
      <div
        class="flex  flex-col items-center justify-center mx-auto  "
      >
        <h3
          class="text-6xl md:text-7xl text-accent text-center flex gap-6 items-center font-display  bg-clip-text bg-primary uppercase tracking-tight"
        >
          <svg lucideWaves class="w-6 h-6 text-accent shrink-0"></svg>
          {{ title() }}
          <svg lucideWaves class="w-6 h-6 text-accent shrink-0 rotate-180"></svg>
        </h3>
        <ng-content></ng-content>
        @if (description()) {
          <p class="text-xl text-white mt-1 text-center font-display">
            {{ description() }}
          </p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateSectionTitleComponent {
  title = input.required<string>();
  description = input<string>("");
}
