import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'reactjs-scratch': path.resolve(__dirname, '../src')
    }
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'reactjs-scratch'
  }
});