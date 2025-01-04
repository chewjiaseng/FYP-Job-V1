// src/plugins/vuetify.js
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Import Vuetify styles

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light', // Set your default theme
  },
});

export default vuetify;
