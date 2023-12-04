import { defineConfig } from 'vite';
import glob from 'fast-glob';
import { resolve } from 'path';

/** Specify which is the source folder name */
const sourceFolder = 'website';

export default defineConfig({
  base: './',
  root: sourceFolder,
  build: {
    /* Because of `root path` has changed, `ourDir` and `emptyOutDir` must be
    * specified.
    * - `ourDir`: is relative to `root path`
    * - `emptyOutDir`: true === override
    */
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: glob.sync(`./${sourceFolder}/**/*.html`).map(
        entry => resolve(__dirname, entry)
      ),
    },
  },
})
