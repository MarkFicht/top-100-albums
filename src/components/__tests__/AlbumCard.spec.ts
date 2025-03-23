import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AlbumCard from '../AlbumCard.vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

const vuetify = createVuetify()

const mockAlbum = {
  id: {
    attributes: {
      'im:id': '123',
    },
  },
  'im:name': {
    label: 'Mock Album Name',
  },
  'im:artist': {
    label: 'Mock Artist',
  },
  'im:image': [
    {},
    {}, // ważne! 3. obrazek
    { label: 'https://via.placeholder.com/150' },
  ],
  'im:price': {
    label: '$9.99',
  },
  'im:releaseDate': {
    attributes: {
      label: '2023-01-01',
    },
  },
  category: {
    attributes: {
      label: 'Rock',
    },
  },
  rights: {
    label: '℗ Mock Rights',
  },
  link: {
    attributes: {
      href: 'https://music.example.com',
    },
  },
}

describe('AlbumCard.vue', () => {
  it('renders album name and artist', () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum,
        favorites: ['123'],
      },
      global: {
        plugins: [vuetify],
        mocks: {
          $router: {
            push: vi.fn(),
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Mock Album Name')
    expect(wrapper.text()).toContain('Mock Artist')
  })

  it('emits toggle-favorite when heart is clicked', async () => {
    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum,
        favorites: ['123'],
      },
      global: {
        plugins: [vuetify],
        mocks: {
          $router: {
            push: vi.fn(),
          },
        },
      },
    })

    const favButton = wrapper.find('[data-test="favorite-button"]')
    expect(favButton.exists()).toBe(true) // <- sanity check
    await favButton.trigger('click')

    expect(wrapper.emitted('toggle-favorite')).toHaveLength(1)
    expect(wrapper.emitted('toggle-favorite')).toBeTruthy()
    expect(wrapper.emitted('toggle-favorite')![0]).toEqual(['123'])
  })

  it('navigates to album details on card click', async () => {
    const push = vi.fn()

    const wrapper = mount(AlbumCard, {
      props: {
        album: mockAlbum,
        favorites: [],
      },
      global: {
        plugins: [vuetify],
        mocks: {
          $router: {
            push,
          },
        },
      },
    })

    await wrapper.trigger('click')
    expect(push).toHaveBeenCalledWith('/album/123')
  })
})
