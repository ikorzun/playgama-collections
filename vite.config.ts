import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Pages serves this project repo from /playgama-collections/. The build and
// `vite preview` both use that base; the dev server stays at the root.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/playgama-collections/' : '/',
  plugins: [react()],
}));
