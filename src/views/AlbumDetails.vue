<script setup lang="ts">
import type { Album } from '@/types/Album'
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const album = ref<Album | null>(null)
const previewUrl = ref('')
const showPlayer = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)
const isLoadingPreview = ref(true)
const error = ref<string | null>(null)
const loaded = ref(false)

const releaseDate = computed(() => album.value?.['im:releaseDate']?.attributes?.label ?? 'Unknown')
const genre = computed(() => album.value?.category?.attributes?.label ?? 'Unknown')
const price = computed(() => album.value?.['im:price']?.label ?? 'N/A')
const rights = computed(() => album.value?.rights?.label ?? '')

const fetchAlbumFromStorage = (): Album | null => {
  try {
    const raw = localStorage.getItem('albums')
    if (!raw) return null
    const all = JSON.parse(raw)
    return all.find((a: Album) => a.id.attributes['im:id'] === route.params.id)
  } catch (e) {
    console.error('❌ Failed to parse albums from localStorage', e)
    return null
  }
}

const fetchPreview = async (search: string) => {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(search)}&limit=1`,
    )
    const data = await res.json()
    const result = data.results?.[0]
    if (result?.previewUrl) previewUrl.value = result.previewUrl
    else error.value = 'No song preview'
  } catch (e) {
    console.error('🔴 Preview fetch error', e)
    error.value = 'Error while downloading preview'
  } finally {
    isLoadingPreview.value = false
  }
}

const playPreview = async () => {
  if (!previewUrl.value) return
  showPlayer.value = true
  await nextTick()
  if (audioRef.value) {
    audioRef.value.src = previewUrl.value
    audioRef.value.play().catch((err) => {
      console.warn('🚫 Autoplay blocked:', err)
    })
  }
}

onMounted(async () => {
  const found = fetchAlbumFromStorage()
  if (!found) {
    error.value = 'Album not found in local storage.'
    return router.replace({ name: 'NotFound' })
  }
  album.value = found
  const searchQuery = `${album.value['im:name'].label} ${album.value['im:artist'].label}`
  await fetchPreview(searchQuery)
})
</script>

<template lang="pug">
template(v-if="album")
  v-container.pt-2.pt-md-5(role="main")
    v-btn.mb-4(
      variant="outlined",
      data-cy="back-button"
      color="primary",
      size="large",
      prepend-icon="mdi-arrow-left",
      @click.prevent.stop="$router.back()"
    ) Back

    h2.mb-2 {{ album['im:name'].label }}
    p.text-grey-darken-1.mb-4 by {{ album['im:artist'].label }}

    v-row
      v-col(cols="12" md="6" class="mx-auto d-flex justify-center")
        v-img.album-img(
          :src="album['im:image'][2].label",
          :alt="`${album['im:name'].label} — album cover`",
          aspect-ratio="1",
          cover,
          loading="lazy",
          max-width="320",
          :class="{ loaded }",
          @load="loaded = true"
        )

    v-row.gy-2.mt-4
      v-col(cols="12" sm="6" md="4")
        p.mb-1
          strong Release date:
          |  {{ releaseDate }}

      v-col(cols="12" sm="6" md="4")
        p.mb-1
          strong Genre:
          |  {{ genre }}

      v-col(cols="12" sm="6" md="4")
        p.mb-1
          strong Price:
          |  {{ price }}

      v-col(cols="12" md="12")
        p.text-caption.text-grey-darken-1(v-if="rights") {{ rights }}

    v-btn.mt-4(color="primary", :href="album.link.attributes.href", target="_blank", rel="noopener noreferrer")
      | View in Apple Music

    v-row.mt-5.justify-center
      v-col(cols="12" md="8" lg="6")
        h5.mb-3.text-center Preview Track

        v-alert(
          type="info",
          v-if="isLoadingPreview",
          density="compact",
          class="mb-2"
        ) Loading preview...

        v-alert(
          type="error",
          v-else-if="error",
          density="compact",
          class="mb-2"
        ) {{ error }}

        v-btn.mt-2.mb-4.mx-auto.d-block(
          v-if="!error && previewUrl && !showPlayer && !isLoadingPreview",
          variant="outlined",
          color="primary",
          @click.prevent.stop="playPreview"
        ) ▶️ Play preview

        audio(
          v-if="previewUrl && showPlayer",
          ref="audioRef",
          controls,
          preload="none",
          class="d-block mx-auto",
          style="max-width: 100%;"
        )
</template>

<style scoped lang="scss">
.album-img {
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
  background-color: #f0f0f0;
  border-radius: 12px;

  &.loaded {
    opacity: 1;
  }
}
</style>
