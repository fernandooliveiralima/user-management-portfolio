describe('Posts - Online (Real API)', () => {
  it('deve listar posts corretamente vindo da API real', () => {
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
