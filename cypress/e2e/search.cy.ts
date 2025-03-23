describe('Search functionality', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://itunes.apple.com/us/rss/topalbums/limit=100/json').as(
      'fetchAlbums',
    )
    cy.visit('/')
    cy.wait('@fetchAlbums')
  })

  it('Searches and opens album details', () => {
    cy.get('[data-cy="search-input"]').type('metallica')
    cy.get('[data-cy="album-card"]').should('exist')

    cy.get('[data-cy="album-card"][data-name*="metallica"]', { timeout: 4000 }).first().click()

    cy.url().should('include', '/album/')
    cy.get('[data-cy="back-button"]').click()
    cy.wait('@fetchAlbums')

    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  })

  it('Shows message when no albums match search', () => {
    cy.get('[data-cy="search-input"]').type('asdkjqwe')

    cy.get('[data-cy="no-results"]').should('exist')
    cy.get('[data-cy="no-results"]').should('be.visible')
  })
})
