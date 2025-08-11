// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";
import rename from "astro-rename";
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  output: "static",

  site: "https://example.com",
  build: {
      assets: "s",
      inlineStylesheets: "never",
  },

  vite: {
      plugins: [tailwindcss()],
  },

  integrations: [
    sitemap(),
    rename({
        matchClasses: (key) => `(:^|[^-&;:_])(${key})(?![a-zA-Z0-9=_-])(:$|[^-&;:_\./])`,
    }),
    compress({
        CSS: true,
        HTML: true,
        JavaScript: true,
        Image: false,
        SVG: false,
    })]
});