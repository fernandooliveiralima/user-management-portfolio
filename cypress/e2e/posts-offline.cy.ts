describe('Posts - API Offline', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/posts', {
      statusCode: 503,
      body: [
        { userId: 1, id: 999, title: 'Post de Erro', body: 'Este post só aparece se quebrar' },
      ],
    }).as('getPostsOffline');
  });

  it('should display an empty list message when the API fails', () => {
    cy.visit('/');

    cy.wait('@getPostsOffline');

    cy.contains('Post Mock 1').should('not.exist');

    cy.contains('Nenhum post encontrado.').should('be.visible');
  });
});
