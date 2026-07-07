// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import angular from "@analogjs/astro-angular";

// https://astro.build/config
export default defineConfig({
  integrations: [angular()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["@lucide/angular"],
    },
  },
});