import { ref, onMounted, watch } from 'vue'
import type { Album } from '@/types/Album'

export function useAlbums() {
  const albums = ref<Album[]>([])
  const loading = ref(true)

  const fetchAlbums = async () => {
    try {
      const res = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=100/json')
      const data = await res.json()
      albums.value = data.feed.entry
    } catch (error) {
      console.error('Failed to fetch albums', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchAlbums)

  watch(albums, (val) => {
    try {
      localStorage.setItem('albums', JSON.stringify(val))
    } catch (err) {
      console.warn('⚠️ Error saving albums to localStorage', err)
    }
  })

  return { albums, loading }
}
