/// <reference types="cypress" />

import { BALANCE_999, MULTICALL_ADDRESS } from './constants';

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

Cypress.Commands.add('interceptLoadTokenBalance', () => {
  cy.intercept('POST', `https://eth-sepolia.g.alchemy.com/v2/**`, (req) => {
    if (req.body.method === 'eth_call') {
      if (req.body.params[0].to === MULTICALL_ADDRESS) {
        req.reply({
          statusCode: 200,
          body: {
            jsonrpc: '2.0',
            id: 0,
            result: BALANCE_999,
          },
        });
        return;
      }

      req.reply({
        statusCode: 200,
        body: {
          jsonrpc: '2.0',
          id: 0,
          result: '0x',
        },
      });
    }
  });
});
