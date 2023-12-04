import { defineConfig } from 'vite';
import glob from 'fast-glob';
import path from 'path';

/** Specify which is the source folder name */
const sourceFolder = 'website';

export default defineConfig({
  base: './',
  root: sourceFolder,
  build: {
    /* Because of `root path` has changed, `ourDir` and `emptyOutDir` must be
    * specify.
    * - `ourDir`: is relative to `root path`
    * - `emptyOutDir`: true === override
    */
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: glob.sync(`./${sourceFolder}/**/*.html`).map(
        entry => path.resolve(__dirname, entry)
      )
    },
  },
})
