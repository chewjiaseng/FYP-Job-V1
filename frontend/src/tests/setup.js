import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import { config } from '@vue/test-utils'
import 'vuetify/styles'

// ✅ Create Vuetify instance
const vuetify = createVuetify()

// ✅ Create a mock Vue Router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [], // Empty routes for testing
})

// ✅ Provide Vuetify and Router globally for all tests
config.global.plugins = [vuetify, router]
