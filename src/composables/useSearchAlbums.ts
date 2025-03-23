import { ref, watch } from 'vue'
import { debounce } from 'Lodash'

export function useSearchAlbums() {
  const rawQuery = ref('')
  const searchQuery = ref('')
  const errorSearch = ref<string | null>(null)
  const isSearching = ref(false)
  const controller = ref<AbortController | null>(null)

  const validateInput = (input: string): boolean => {
    const forbidden = /[<>$`"'=\\;]/ // basic injection protection
    return !forbidden.test(input)
  }

  // 🧪 "Fake API search"
  const simulateSearchRequest = (query: string, signal: AbortSignal): Promise<string> => {
    return new Promise((resolve, reject) => {
      const delay = setTimeout(() => {
        resolve(query.trim())
      }, 300)

      signal.addEventListener('abort', () => {
        clearTimeout(delay)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    })
  }

  const clearSearch = () => {
    rawQuery.value = ''
  }

  const debouncedSearch = debounce(async (val: string) => {
    if (!validateInput(val)) {
      errorSearch.value = 'The search phrase contains forbidden characters.'
      return
    }

    if (controller.value) controller.value.abort()
    controller.value = new AbortController()

    errorSearch.value = null
    isSearching.value = true

    try {
      const result = await simulateSearchRequest(val, controller.value.signal)
      searchQuery.value = result
    } catch (err) {
      if ((err as DOMException).name !== 'AbortError') {
        errorSearch.value = 'Error while searching'
      }
    } finally {
      isSearching.value = false
    }
  }, 300)

  watch(rawQuery, (val) => {
    debouncedSearch(val)
  })

  return {
    rawQuery,
    searchQuery,
    clearSearch,
    errorSearch,
    isSearching,
  }
}
