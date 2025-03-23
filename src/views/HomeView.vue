<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

import { useAlbums } from '@/composables/useAlbums'
import { useSearchAlbums } from '@/composables/useSearchAlbums'
import { useFavorites } from '@/composables/useFavorites'
import { useSortedAlbums } from '@/composables/useSortedAlbums'

import AlbumCard from '@/components/AlbumCard.vue'

const isToolbarHidden = ref(false)

const lastScrollY = ref(window.scrollY)
const handleScroll = () => {
  const currentY = window.scrollY
  const goingDown = currentY > lastScrollY.value

  isToolbarHidden.value = goingDown && currentY > 100

  lastScrollY.value = currentY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const { albums, loading } = useAlbums()
const { rawQuery, searchQuery, clearSearch, errorSearch, isSearching } = useSearchAlbums()
const { favorites, toggleFavorite } = useFavorites()
const { sortedAlbums, sortBy, sortOptions, showOnlyFavorites } = useSortedAlbums(
  albums,
  searchQuery,
  favorites,
)
</script>

<template lang="pug">
v-container.pt-2.pt-md-5(fluid, role="main")
  h2.mb-4.font-weight-medium Top 100 Albums

  // 🔍 Sticky Search / Sort / Favorites
  v-sheet.sticky-toolbar(elevation="2", class="mb-4" :class="{ 'is-hidden': isToolbarHidden }")
    v-container.py-2
      v-row.align-center.gy-3.p-2
        v-col(cols="12" md="4")
          v-text-field(
            v-model="rawQuery",
            data-cy="search-input",
            label="Search by album or artist...",
            density="comfortable",
            variant="outlined",
            prepend-inner-icon="mdi-magnify",
            :loading="isSearching",
            :error-messages="errorSearch ? [errorSearch] : []",
            autofocus,
            aria-label="Album search box",
            hide-details="auto",
            :append-inner-icon="rawQuery ? 'mdi-close-circle' : ''",
            @click:append-inner="clearSearch",
            @keydown.esc="clearSearch"
          )

        v-col(cols="6" md="4")
          v-select(
            v-model="sortBy",
            data-cy="select-sort",
            label="Sort by",
            :items="sortOptions",
            variant="outlined",
            density="comfortable",
            aria-label="Sort by",
            hide-details="auto"
          )

        v-spacer

        v-col(cols="6" md="auto", class="d-flex justify-end")
          v-btn(
            :icon="true",
            :color="showOnlyFavorites ? 'red-darken-2' : 'grey-darken-1'",
            variant="outlined",
            @click="showOnlyFavorites = !showOnlyFavorites",
            :aria-pressed="showOnlyFavorites",
            aria-label="Show only favorite albums",
            style="min-width: 48px; min-height: 48px"
            data-test="favorite-button",
          )
            v-icon(size="24") {{ showOnlyFavorites ? 'mdi-heart' : 'mdi-heart-outline' }}

  // 🔄 Loading
  v-row.justify-center.my-4(v-if="loading")
    v-col(cols="auto")
      v-progress-circular(indeterminate color="primary")

  // 📦 Albums
  v-row(v-if="!loading && sortedAlbums.length > 0")
    v-col(
      v-for="album in sortedAlbums",
      :key="album.id.attributes['im:id']",
      cols="12",
      sm="6",
      md="4",
      lg="3"
    )
      AlbumCard(
        :album="album",
        :favorites="favorites",
        @toggle-favorite="toggleFavorite"
      )

  // ❌ No results
  v-row.justify-center.mt-5(v-if="!loading && sortedAlbums.length === 0")
    v-col(cols="auto")
      p.text-grey(data-cy="no-results") No results matching your query
</template>

<style scoped lang="scss">
.sticky-toolbar {
  position: sticky;
  top: 64px;
  z-index: 20;
  background-color: rgba(var(--v-theme-surface), 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  animation: fade-slide 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  will-change: transform, opacity;
}

.sticky-toolbar.is-hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

@keyframes fade-slide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
