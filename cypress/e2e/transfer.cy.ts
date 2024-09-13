import { transactionData } from '../support/constants';

describe('Transfer', function () {
  beforeEach(() => {
    cy.visit('/');
    cy.interceptLoadTokenBalance();
    cy.connectWallet();
    cy.wait(1000); // wait tokens to be loaded

    cy.getByTestId(`tab-item-Transfer`).click();

    cy.getByTestId('transfer-button').as('transferButton');
    cy.getByTestId('target-address').as('targetAddress');
    cy.getByTestId('amount').as('amount');
    cy.getByTestId('select-token').as('selectToken');
  });

  it('should have a token selected as default', () => {
    cy.get('@selectToken').find('input').should('have.value', transactionData.defaultToken.name);
  });

  it('should change token', () => {
    cy.changeSelect('@selectToken', `${transactionData.token.name}-token`, transactionData.token.name);
  });

  it('should validate address', () => {
    cy.fillInput('@targetAddress', 'wrong-address');
    cy.get('@targetAddress').get('.MuiInputBase-root').should('have.class', 'Mui-error');

    cy.fillInput('@amount', '1');
    cy.get('@transferButton').should('be.disabled');

    cy.get('@targetAddress').clear();
    cy.get('@targetAddress').get('.MuiInputBase-root').should('not.have.class', 'Mui-error');

    cy.get('@transferButton').should('be.disabled');
  });

  it('should validate amount', function () {
    cy.fillInput('@targetAddress', transactionData.targetAddress);

    // amount is empty
    cy.get('@transferButton').should('be.disabled');

    // amount is more than balance
    cy.fillInput('@amount', '1000');
    cy.get('@amount').get('.MuiInputBase-root').should('have.class', 'Mui-error');
    cy.get('@transferButton').should('be.disabled');

    // amount is valid
    cy.get('@amount').find('input').clear();
    cy.fillInput('@amount', '1');
    cy.get('@amount').get('.MuiInputBase-root').should('not.have.class', 'Mui-error');
    cy.get('@transferButton').should('not.be.disabled');
  });

  it('should transfer', () => {
    cy.changeSelect('@selectToken', `${transactionData.token.name}-token`, transactionData.token.name);

    cy.fillInput('@targetAddress', transactionData.targetAddress);

    cy.fillInput('@amount', transactionData.amount);

    cy.intercept('POST', 'https://eth-sepolia.g.alchemy.com/v2/**').as('simulate-contract');

    cy.get('@transferButton').click();

    cy.wait('@simulate-contract').then(({ request }) => {
      expect(request.body.params[0].from).to.eq(transactionData.userAddress);
      expect(request.body.params[0].to).to.eq(transactionData.token.address);
      expect(request.body.params[0].data).to.eq(transactionData.transferData);
    });
  });
});
