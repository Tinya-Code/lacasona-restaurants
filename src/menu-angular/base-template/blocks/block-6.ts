import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import type { Category } from "../../core/models/category.model";
import type { Product } from "../../core/models/product.model";
import { TemplateCardComponent } from "../components/template-card/template-card";
import { TemplateSectionTitleComponent } from "../components/template-section-title/template-section-title.component";

@Component({
  selector: "app-block-6",
  standalone: true,
  imports: [TemplateCardComponent, TemplateSectionTitleComponent],
  template: `
    @if (categories().length > 0) {
      <section class="relative py-12">
        @for (
          cat of categories();
          track cat.id;
          let isLast = $last;
          let total = $count
        ) {
          <section [id]="'category-' + cat.id" class="flex flex-col w-full">
            <app-template-section-title
              [title]="cat.name"
              [description]="cat.description || ''"
            ></app-template-section-title>

            <div class="grid grid-cols-5 gap-8">
              <div class="grid grid-cols-2 md:grid-cols-2 col-span-4">
                @for (product of cat.products; track product.id) {
                  <app-template-card
                    [product]="product"
                    (productClick)="productClick.emit($event)"
                    (addToCart)="addToCart.emit($event)"
                  >
                  </app-template-card>
                }
              </div>
              <section
                class="hidden md:flex flex-col gap-4 col-span-1 justify-evenly"
              >
                <img
                  src="/images/sections/clasicos-daiquiri-fresa.webp"
                  alt="Clásicos Daiquiri Fresa"
                  class="max-h-[900px] w-auto object-contain"
                />
                <img
                  src="/images/sections/clasicos-piña-colada.webp"
                  alt="Clásicos Piña Colada"
                  class="max-h-[900px] w-auto object-contain"
                />
              </section>
            </div>
          </section>
        }
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Block6Component {
  categories = input.required<Category[]>();
  templateData = input<any>();
  productClick = output<Product>();
  addToCart = output<Product>();
}
