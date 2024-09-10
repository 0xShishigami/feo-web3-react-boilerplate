declare namespace Cypress {
  interface Chainable {
    getByTestId(testId: string): Chainable<Subject>;
    connectWallet(): Chainable<Subject>;
  }
}
