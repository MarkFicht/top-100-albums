import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFound from '@/views/NotFound.vue'
import { createVuetify } from 'vuetify'
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'Home', component: { template: '<div>Home</div>' } }],
})

describe('NotFound.vue', () => {
  const vuetify = createVuetify()

  it('renders 404 content', () => {
    const wrapper = mount(NotFound, {
      global: {
        plugins: [vuetify, router],
      },
    })

    expect(wrapper.text()).toContain('404 – The Lost Record')
    expect(wrapper.text()).toContain('Spin Back Home')
  })

  it('navigates home on button click', async () => {
    const pushMock = vi.fn()
    router.push = pushMock

    const wrapper = mount(NotFound, {
      global: {
        plugins: [vuetify, router],
      },
    })

    const btn = wrapper.get('[data-cy="back-button"]')
    await btn.trigger('click')

    expect(pushMock).toHaveBeenCalledWith('/')
  })
})
