describe('Posts - API Offline', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/posts', {
      statusCode: 503,  /* Simula servidor fora do ar */
      body: [
        { userId: 1, id: 999, title: 'Post de Erro', body: 'Este post só aparece se quebrar' },
      ],
    }).as('getPostsOffline');
  });

  it('deve exibir mensagem de lista vazia quando a API falhar', () => {
    cy.visit('/');

     /* Aguarda o estouro do erro de rede */
    cy.wait('@getPostsOffline');

     /* Valida que os posts não existem na tela */
    cy.contains('Post Mock 1').should('not.exist');

     /* Valida se a interface mostra a mensagem do @empty */
    cy.contains('Nenhum post encontrado.').should('be.visible');
  });
});
