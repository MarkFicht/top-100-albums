<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'

defineProps(['album', 'favorites'])
defineEmits(['toggle-favorite'])

const theme = useTheme()

const loaded = ref(false)
</script>

<template lang="pug">
v-card.album-card(
  elevation="2",
  rounded="lg",
  @click="$router.push(`/album/${album.id.attributes['im:id']}`)",
  data-cy="album-card",
  :data-name="album['im:name'].label.toLowerCase()"
)

  v-img.album-img(
    :src="album['im:image'][2].label",
    :alt="`${album['im:name'].label} — album cover`",
    aspect-ratio="1",
    cover,
    loading="lazy",
    :class="{ loaded }",
    @load="loaded = true"
  )

  v-card-text
    h5.mb-1.text-body-1.text-truncate {{ album['im:name'].label }}
    p.text-caption.text-truncate.text-grey-darken-1 {{ album['im:artist'].label }}
    p.text-caption.text-grey-darken-2 {{ album.category.attributes.label }}

  v-btn.fav-btn(
    icon,
    data-cy="fav-btn",
    variant="flat",
    color="white",
    density="comfortable",
    :class="theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-white'"
    elevation="2",
    data-test="favorite-button"
    :aria-label="favorites.includes(album.id.attributes['im:id']) ? 'Remove from favorites' : 'Add to favorites'",
    :title="favorites.includes(album.id.attributes['im:id']) ? 'Remove from favorites' : 'Add to favorites'",
    @click.stop.prevent="$emit('toggle-favorite', album.id.attributes['im:id'])"
  )
    v-icon(
      data-cy="fav-icon",
      :color="favorites.includes(album.id.attributes['im:id']) ? 'red-darken-2' : 'grey-darken-1'",
      size="20"
    ) {{ favorites.includes(album.id.attributes['im:id']) ? 'mdi-heart' : 'mdi-heart-outline' }}
</template>

<style scoped lang="scss">
.album-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.album-img {
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
  background-color: #f0f0f0;

  &.loaded {
    opacity: 1;
  }
}

.fav-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9) !important;
  border-radius: 50%;
}
</style>
