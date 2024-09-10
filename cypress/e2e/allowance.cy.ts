import { transactionData } from '../support/constants';

const fillInputAmount = (amount: string) => {
  cy.fillInput('@amount', amount);
};

const fillInputAddress = (address: string) => {
  cy.fillInput('@targetAddress', address);
};

const selectToken = (tokenId: string, token: string) => {
  cy.changeSelect('@selectToken', tokenId, token);
};

const clickApproveButton = () => {
  cy.clickButton('@approveButton');
};

describe('Allowance', function () {
  beforeEach(() => {
    cy.visit('/');
    cy.connectWallet();
    cy.wait(1000); // wait tokens to be loaded

    cy.getByTestId('approve-button').as('approveButton');
    cy.getByTestId('target-address').as('targetAddress');
    cy.getByTestId('amount').as('amount');
    cy.getByTestId('select-token').as('selectToken');
  });

  it('should have a token selected as default', () => {
    cy.get('@selectToken').find('input').should('have.value', transactionData.defaultToken.name);
  });

  it('should change token', () => {
    selectToken(`${transactionData.token.name}-token`, transactionData.token.name);
  });

  it('should validate address', () => {
    fillInputAddress('wrong-address');
    cy.get('@targetAddress').get('.MuiInputBase-root').should('have.class', 'Mui-error');

    fillInputAmount('100');
    cy.get('@approveButton').should('be.disabled');

    cy.get('@targetAddress').clear();
    cy.get('@targetAddress').get('.MuiInputBase-root').should('not.have.class', 'Mui-error');

    cy.get('@approveButton').should('be.disabled');
  });

  it('should validate amount', function () {
    fillInputAddress(transactionData.targetAddress);

    // amount is empty

    cy.get('@approveButton').should('be.disabled');
  });

  it('should approve new allowance', () => {
    selectToken(`${transactionData.token.name}-token`, transactionData.token.name);

    fillInputAddress(transactionData.targetAddress);

    fillInputAmount(transactionData.amount);

    cy.intercept('POST', 'https://eth-sepolia.g.alchemy.com/v2/**').as('simulate-contract');

    clickApproveButton();

    cy.wait('@simulate-contract').then(({ request }) => {
      expect(request.body.params[0].from).to.eq(transactionData.userAddress);
      expect(request.body.params[0].to).to.eq(transactionData.token.address);
      expect(request.body.params[0].data).to.eq(transactionData.allowanceData);
    });
  });
});
