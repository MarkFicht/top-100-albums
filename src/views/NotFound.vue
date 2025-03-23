<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template lang="pug">
v-container.text-center.mt-10
  v-row.justify-center.align-center(style="min-height: 60vh")
    v-col(cols="12" sm="10" md="8" lg="6")
      v-card(elevation="2", class="pa-5 rounded-lg")

        v-alert(
          type="error",
          variant="outlined",
          class="mb-4",
          density="comfortable"
        ) 404 – The Lost Record 🎶

        v-card-text
          v-icon.mx-auto.mb-4(
            icon="mdi-music-off",
            size="100",
            color="grey-darken-2",
            class="my-4"
          )

          p.text-body-1.mb-3
            | Looks like this album got scratched or never existed.



          v-btn(
            data-cy="back-button"
            color="primary",
            @click="router.push('/')",
            aria-label="Return to homepage"
          ) 🔁 Spin Back Home
</template>
