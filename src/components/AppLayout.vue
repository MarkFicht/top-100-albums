<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()

const toggleDark = () => {
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
  theme.global.name.value = newTheme

  localStorage.setItem('theme', newTheme)
}
</script>

<template lang="pug">
v-app
  // --- 🔝 Top app bar
  v-app-bar(app color="surface" elevate-on-scroll)
    v-toolbar-title.text-h6.font-weight-bold 🎧 Vue Music Browser
    v-spacer
    v-btn(icon @click="toggleDark" :aria-label="`Przełącz motyw`")
      v-icon mdi-theme-light-dark

  // --- 📦 Main content (slot)
  v-main
    v-container.py-5
      slot

  // --- 🔚 Footer
  v-footer(app padless :class="theme.global.current.value.dark ? 'bg-grey-darken-4 text-white' : 'bg-grey-lighten-4 text-black'")
    v-col.text-center.text-caption.py-3
      | &copy; {{ new Date().getFullYear() }} – Made with 💿 & 🎵
</template>
