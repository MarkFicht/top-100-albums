export interface Album {
  id: {
    attributes: {
      'im:id': string
    }
  }
  'im:name': { label: string }
  'im:artist': { label: string }
  'im:image': { label: string }[]
  'im:releaseDate': {
    label?: string
    attributes?: { label: string }
  }
  'im:price'?: {
    label: string
  }
  category: {
    attributes: {
      label: string
      term?: string
    }
  }
  link: {
    attributes: {
      href: string
    }
  }
  title?: {
    label: string
  }
  rights?: {
    label: string
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [key: string]: any
}
