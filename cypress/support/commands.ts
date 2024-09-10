/// <reference types="cypress" />
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('connectWallet', () => {
  cy.getByTestId('connect-button').as('btn').click();
  cy.getByTestId('connect-button').contains('Connect Wallet').should('not.exist');
  cy.get('body').type('{esc}');
});
