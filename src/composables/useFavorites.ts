import { ref, watch } from 'vue'
import { safeParse } from '@/utils/safeParse'

export function useFavorites() {
  const favorites = ref<string[]>(safeParse(localStorage.getItem('favorites'), []))

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('favorites')
      const parsed = raw ? JSON.parse(raw) : []
      favorites.value = Array.isArray(parsed) ? parsed : []
    } catch (err) {
      console.warn('⚠️ Error reading localStorage (favorites)', err)
      favorites.value = []
    }
  }

  watch(
    favorites,
    (val) => {
      localStorage.setItem('favorites', JSON.stringify(val))
    },
    { deep: true },
  )

  const toggleFavorite = (id: string) => {
    if (typeof id !== 'string') return

    const index = favorites.value.indexOf(id)
    if (index > -1) favorites.value.splice(index, 1)
    else favorites.value.push(id)
  }

  return {
    favorites,
    toggleFavorite,
  }
}
