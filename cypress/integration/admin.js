const baseUrl = 'http://localhost:3000'

describe('Admin login', function() {
  it('should have a clickable link on front page', function() {
    cy.visit(baseUrl)
    cy.contains('Hallinta').click()
  })

  it('should show admin login', function() {
    cy.contains('Kirjaudu')
    cy.contains('Sähköposti')
    cy.contains('Salasana')
  })

  it('should fail with wrong credentials', function() {
    cy.get('input:first').type('sampo@athene.fi')
    cy.get('input:last').type('password')
    cy.get('#login-button').click()
    cy.contains('Kirjautuminen epäonnistui')
  })

  it('should open the admin view with correct credentials', function() {
    cy.get('input:first').clear().type('ville@athene.fi')
    cy.get('input:last').clear().type('password')
    cy.get('#login-button').click()
    cy.contains('+ Uusi tapahtuma')
    cy.contains('Käyttäjien hallintapaneeli')
  })

})

describe('The admin view', function() {
  it('should show list of users', function() {
    cy.contains('Käyttäjien hallintapaneeli').click()
    cy.contains('Toiminnot')
    cy.contains('ville@athene.fi')
  })
  it('should not add a user with empty email', function() {
    cy.contains('Luo uusi käyttäjä')
    cy.get('button').click()
    cy.contains('Käyttäjän luominen epäonnistui')
  })
  it('should create a user with correct email', function() {
    cy.get('input:first').type('ie@athene.fi')
    cy.get('button:first').click()
    cy.contains('ie@athene.fi')
  })
  it('should remove user correctly', function() {
    /* TODO */
    throw new Error('Not implemented')
  })
  const testEvent = {}
  testEvent.name = 'This is a test event'
  it('should create an event', function() {
    cy.contains('Takaisin').click()
    cy.contains('+ Uusi tapahtuma').click()
    cy.contains('Tapahtuman nimi').click().type(testEvent.name)
    /* TODO */
    throw new Error('Not implemented')
  })
  it('should logout correctly', function() {
    cy.contains('Logout').click()
    cy.get('html').should('not.contain', '+ Uusi tapahtuma')
    cy.contains('Kirjaudu')
  })
})
