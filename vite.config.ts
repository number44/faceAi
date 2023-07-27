import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";
const root = __dirname;
const outDir = resolve(__dirname, "dist");
import autoprefixer from "autoprefixer";

export default {
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
    }),
  ],
  build: {
    manifest: true,
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        dowod: resolve(root, "dowod.html"),
        paszport: resolve(root, "paszport.html"),
        prawo: resolve(root, "prawo.html"),
        cv: resolve(root, "cv.html"),
        dyplom: resolve(root, "dyplom.html"),
        legitymacja: resolve(root, "legitymacja.html"),
      },
    },
  },
};
