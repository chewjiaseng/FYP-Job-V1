import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify'; // Import vuetify plugin
import path from 'path'; // Import path module

export default defineConfig({
  plugins: [
    vue(),
    vuetify(),  // Use the Vuetify plugin here
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias to 'src' folder
    },
  },
  test: {
    globals: true,  // Allow you to use global functions like `describe` and `it`
    environment: 'happy-dom',  // Simulate the DOM for testing
    deps: {
      inline: ['vuetify'], // This makes sure Vuetify is processed correctly
    },
    transformMode: {
      web: [/\.vue$/],  // Process .vue files correctly
    },
    setupFiles: ['./src/tests/setup.js'],  // Correct relative path to setup.js
  },
});
