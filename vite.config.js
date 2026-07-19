// import { defineConfig } from 'vite'

// export default defineConfig({
//   root: '.',
//   build: {
//     outDir: 'dist'
//   }
// })

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        getdp: resolve(__dirname, "getdp.html"),
      },
    },
  },
});