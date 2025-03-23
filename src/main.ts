import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/styles/main.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

const userPref = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

vuetify.theme.global.name.value = userPref || (prefersDark ? 'dark' : 'light')

createApp(App).use(router).use(createPinia()).use(vuetify).mount('#app')
