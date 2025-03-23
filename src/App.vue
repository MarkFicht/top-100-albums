<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
</script>

<template lang="pug">
AppLayout
  transition(name="slide-fade" mode="out-in")
    RouterView
</template>
