// vitest.config.js
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    resolve: {
        alias: {
          '@': '/src',  // Make sure this points to the src directory
        }
      },
  plugins: [vue()],
  test: {
    globals: true,  // Allow you to use global functions like `describe` and `it`
    environment: 'jsdom',  // Simulate the DOM for testing
    transformMode: {
      web: [/\.vue$/],  // Process .vue files correctly
    },
  },
});
