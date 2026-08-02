describe('Posts - Online (Real API)', () => {
  it('should correctly list posts from the real API', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        sessionStorage.clear();
      },
    });

    cy.get('[data-cy="post-card"]', { timeout: 10000 }).should('have.length.at.least', 1);

    cy.get('[data-cy="post-card-title"]').first().should('be.visible');
  });
});
