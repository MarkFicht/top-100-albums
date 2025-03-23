import type { Album } from '@/types/Album'
import { ref, computed, type Ref } from 'vue'

export function useSortedAlbums(
  albums: Ref<Album[]>,
  searchQuery: Ref<string>,
  favorites: Ref<string[]>,
) {
  const showOnlyFavorites = ref(false)
  const sortBy = ref<'default' | 'title' | 'artist' | 'genre' | 'favorites'>('default')

  const sortOptions = ref([
    { title: 'Default', value: 'default' },
    { title: 'Title (A-Z)', value: 'title' },
    { title: 'Artist (A-Z)', value: 'artist' },
    { title: 'Genre (A-Z)', value: 'genre' },
    { title: 'Favorites First', value: 'favorites' },
  ])

  const filteredAlbums = computed(() => {
    return albums.value.filter((album) => {
      const title = album['im:name'].label.toLowerCase()
      const artist = album['im:artist'].label.toLowerCase()
      const matchesSearch =
        title.includes(searchQuery.value.toLowerCase()) ||
        artist.includes(searchQuery.value.toLowerCase())

      const matchesFav =
        !showOnlyFavorites.value || favorites.value.includes(album.id.attributes['im:id'])

      return matchesSearch && matchesFav
    })
  })

  const sortedAlbums = computed(() => {
    const result = [...filteredAlbums.value]

    if (sortBy.value === 'title') {
      result.sort((a, b) => a['im:name'].label.localeCompare(b['im:name'].label))
    } else if (sortBy.value === 'artist') {
      result.sort((a, b) => a['im:artist'].label.localeCompare(b['im:artist'].label))
    } else if (sortBy.value === 'favorites') {
      result.sort((a, b) => {
        const aFav = favorites.value.includes(a.id.attributes['im:id']) ? -1 : 1
        const bFav = favorites.value.includes(b.id.attributes['im:id']) ? -1 : 1
        return aFav - bFav
      })
    } else if (sortBy.value === 'genre') {
      result.sort((a, b) => a.category.attributes.label.localeCompare(b.category.attributes.label))
    }

    return result
  })

  return {
    sortBy,
    sortOptions,
    showOnlyFavorites,
    sortedAlbums,
  }
}
