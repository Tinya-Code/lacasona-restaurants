// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import angular from "@analogjs/astro-angular";
import icon from 'astro-icon';
// https://astro.build/config
export default defineConfig({
  integrations: [angular(), icon()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["@lucide/angular"],
    },
  },
});