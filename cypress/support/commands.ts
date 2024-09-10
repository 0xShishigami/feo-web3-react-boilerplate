/// <reference types="cypress" />
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('connectWallet', () => {
  cy.getByTestId('connect-button').as('btn').click();
  cy.getByTestId('connect-button').contains('Connect Wallet').should('not.exist');
  cy.get('body').type('{esc}');
});

Cypress.Commands.add('fillInput', (testId, value) => {
  cy.get(testId).type(value);
  cy.get(testId).find('input').should('have.value', value);
});

Cypress.Commands.add('changeSelect', (selectId, itemId, value) => {
  cy.get(selectId).click();
  cy.getByTestId(itemId).click();
  cy.get(selectId).find('input').should('have.value', value);
});

Cypress.Commands.add('clickButton', (buttonId) => {
  cy.get(buttonId).should('be.enabled');
  cy.get(buttonId).click();
});
