import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false, // Keep readable for debugging
  target: 'es2020',
  outDir: 'dist',
  splitting: false,
  treeshake: true,
  external: ['xml2js'], // Mark as external dependency
  banner: {
    js: '// Steam ID Resolver TypeScript - Professional Steam API library',
  },
})
