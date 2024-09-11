import { tabs, TOKEN_LIST } from '../support/constants';

describe('App interaction', () => {
  beforeEach(() => {
    // cy.interceptAllResquests();
  });

  it('the page loads', () => {
    cy.visit('/');
    cy.contains(/Wonderland/i).should('exist');
  });

  it('connect wallet', () => {
    cy.visit('/');
    cy.connectWallet();
  });

  it('render balance', () => {
    cy.visit('/');
    cy.getByTestId('balance').should('exist');

    TOKEN_LIST.forEach((token) => {
      cy.getByTestId(`balance-${token.name}`).should('exist');
      cy.getByTestId(`balance-${token.name}`).should('contain', token.name);
      cy.getByTestId(`balance-${token.name}`).should('contain', 'Balance:');
    });
  });

  it('render function tabs', () => {
    cy.visit('/');
    cy.getByTestId('functions-tab').should('exist');

    tabs.forEach((tab) => {
      cy.getByTestId(`tab-item-${tab}`).click();
      cy.getByTestId(`tab-panel-${tab}`).should('be.visible');
    });
  });

  it('render transaction logs', () => {
    cy.visit('/');
    cy.getByTestId('logs').should('exist');
  });
});
