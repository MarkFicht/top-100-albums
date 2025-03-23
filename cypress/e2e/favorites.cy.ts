describe('Favorites functionality', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/topalbums/**').as('fetchAlbums')
    cy.visit('/')
    cy.wait('@fetchAlbums')
  })

  it('Can mark album as favorite and persists after reload', () => {
    cy.get('[data-cy="album-card"]').first().as('firstCard')

    cy.get('@firstCard').find('[data-cy="fav-btn"]').click()
    cy.reload()
    cy.wait('@fetchAlbums')

    cy.get('@firstCard').find('[data-cy="fav-icon"]').should('have.class', 'mdi-heart')
  })
})
