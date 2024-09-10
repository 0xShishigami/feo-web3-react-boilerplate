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
});
