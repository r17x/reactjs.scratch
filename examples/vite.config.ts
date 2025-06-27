import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      'reactjs-scratch/react': path.resolve(__dirname, '../src/react'),
      'reactjs-scratch/react-dom/client': path.resolve(__dirname, '../src/react-dom/client'),
      'reactjs-scratch/jsx-runtime': path.resolve(__dirname, '../src/jsx-runtime.ts'),
      'reactjs-scratch/jsx-dev-runtime': path.resolve(__dirname, '../src/jsx-runtime.ts'),
      'reactjs-scratch': path.resolve(__dirname, '../src')
    }
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'reactjs-scratch'
  }
});