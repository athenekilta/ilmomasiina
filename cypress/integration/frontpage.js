const baseUrl = 'http://localhost:3000'

describe('Ilmomasiina frontpage', function() {
  it('should show up', function() {
    cy.visit(baseUrl)
    cy.contains('Tapahtumat')
    cy.contains('Hallinta')
  })
})
