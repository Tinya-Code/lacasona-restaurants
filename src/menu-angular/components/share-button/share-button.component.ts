import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LucideShare2 } from "@lucide/angular";

@Component({
  selector: "app-share-button",
  standalone: true,
  imports: [LucideShare2],
  template: `
    <button
      (click)="shareMenu()"
      class="flex items-center gap-2 px-8 py-3 bg-primary/80 hover:bg-primary active:scale-95  text-white rounded-full transition-all duration-300 font-bold border border-primary/20 group backdrop-blur-sm"
      title="Compartir este menú"
    >
      <svg
        lucideShare2
        class="w-6 h-6 group-hover:scale-110 transition-transform"
      ></svg>
      <span
        class="text-sm md:text-lg  font-display select-none"
        >Compartir</span
      >
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareButtonComponent {
  async shareMenu() {
    const url = window.location.href;
    const shareData = {
      title: "Menú",
      text: "¡Mira este delicioso menú! 🍜🏮",
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Contenido compartido con éxito");
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          console.error("Error al compartir:", error);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("Enlace copiado al portapapeles");
      } catch (err) {
        console.warn(
          "La API Web Share no está soportada y no se pudo copiar al portapapeles",
        );
      }
    }
  }
}
