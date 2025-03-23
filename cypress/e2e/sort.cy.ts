describe('Sorting functionality', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/topalbums/**').as('fetchAlbums')
    cy.visit('/')
    cy.wait('@fetchAlbums')
  })

  it('Sorts albums by title (A-Z)', () => {
    cy.get('[data-cy="select-sort"]').click()

    // Select option "Title (A-Z)"
    cy.contains('.v-list-item-title', 'Title (A-Z)').should('be.visible').click({ force: true })

    // Wait for the albums to be sorted
    cy.get('[data-cy="album-card"]')
      .should('have.length.greaterThan', 1)
      .then(($cards) => {
        const names = [...$cards].map(
          (card) => card.getAttribute('data-name')?.toLowerCase().trim() ?? '',
        )

        // Check if the names are sorted
        const sorted = [...names].sort((a, b) => a.localeCompare(b))
        expect(names).to.deep.equal(sorted)
      })
  })
})
