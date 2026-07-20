import type { PipeTransform } from "@angular/core";
import { Pipe } from "@angular/core";

@Pipe({
  name: "precio",
  standalone: true,
  pure: true,
})
export class PrecioPipe implements PipeTransform {
  /**
   * Transforma un número en formato de moneda Soles Peruanos (PEN).
   * @param value El valor numérico a formatear.
   * @returns El valor formateado o una cadena vacía si no es un número.
   */
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    const num = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(parseFloat(num))) {
      return "";
    }

    // Detectar si el número tiene decimales significativos
    const hasDecimals = num % 1 !== 0;
    
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    }).format(num);
  }
}
