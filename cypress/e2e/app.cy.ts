import { BALANCE, tabs, TOKEN_LIST } from '../support/constants';

describe('App interaction', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('render the landing', () => {
    cy.getByTestId('landing').should('exist');
  });

  it('connect wallet', () => {
    cy.connectWallet();
  });

  it('render empty balance', () => {
    cy.getByTestId('balance').should('exist');
    TOKEN_LIST.forEach((token) => {
      cy.getByTestId(`balance-${token.name}`).should('exist');
      cy.getByTestId(`balance-${token.name}`).should('contain', token.name);
    });
  });

  it('render balance', () => {
    cy.interceptLoadTokenBalance();
    cy.connectWallet();

    TOKEN_LIST.forEach((token) => {
      cy.getByTestId(`balance-${token.name}`).should('contain', BALANCE);
    });
  });

  it('render function tabs', () => {
    cy.getByTestId('functions-tab').should('exist');

    tabs.forEach((tab) => {
      cy.getByTestId(`tab-item-${tab}`).click();
      cy.getByTestId(`tab-panel-${tab}`).should('be.visible');
    });
  });

  it('render transaction logs', () => {
    cy.getByTestId('logs').should('exist');
  });
});
