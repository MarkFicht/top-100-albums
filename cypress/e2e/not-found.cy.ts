describe('NotFound page', () => {
  it('Redirects to 404 page on invalid album ID', () => {
    cy.visit('/album/fake-id', { failOnStatusCode: false })

    cy.contains('404 – The Lost Record', { timeout: 4000 }).should('be.visible')
    cy.get('[data-cy="back-button"]').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  })
})
