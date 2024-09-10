declare namespace Cypress {
  interface Chainable {
    getByTestId(testId: string): Chainable<Subject>;
    connectWallet(): Chainable<Subject>;
    fillInput(testId: string, value: string): Chainable<Subject>;
    changeSelect(selectId: string, itemId: string, value: string): Chainable<Subject>;
    clickButton(buttonId: string): Chainable<Subject>;
  }
}
