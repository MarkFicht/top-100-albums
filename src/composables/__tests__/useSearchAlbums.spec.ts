import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSearchAlbums } from '../useSearchAlbums'
import { nextTick } from 'vue'

describe('useSearchAlbums', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  // ---
  it('should sanitize and debounce input', async () => {
    const { rawQuery, searchQuery, errorSearch } = useSearchAlbums()

    rawQuery.value = '  hello<>world  '
    await nextTick()
    vi.advanceTimersByTime(350)

    await nextTick()

    expect(errorSearch.value).toBe('The search phrase contains forbidden characters.')
    expect(searchQuery.value).toBe('')
  })

  // ---
  it('should perform valid search and update searchQuery', async () => {
    const { rawQuery, searchQuery, isSearching } = useSearchAlbums()

    rawQuery.value = 'metallica'
    await nextTick()

    expect(isSearching.value).toBe(false)

    vi.advanceTimersByTime(300)
    await nextTick()

    expect(isSearching.value).toBe(true)

    vi.advanceTimersByTime(300)
    await nextTick()

    expect(searchQuery.value).toBe('metallica')
    expect(isSearching.value).toBe(false)
  })
})
