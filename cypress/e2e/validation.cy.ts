describe('Validation and sanitization', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Rejects input with forbidden characters', () => {
    cy.get('[data-cy="search-input"]').type('<script>')
    cy.contains('The search phrase contains forbidden characters.').should('be.visible')
  })

  it('Clears search input with clear button', () => {
    cy.get('[data-cy="search-input"]').type('metallica')
    cy.get('.v-icon.mdi-close-circle').click()
    cy.get('[data-cy="search-input"]').should('have.value', '')
  })
})
