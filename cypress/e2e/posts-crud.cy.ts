describe('Management Posts CRUD', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/posts*', {
      statusCode: 200,
      body: [
        { userId: 1, id: 1, title: 'Primeiro Post', body: 'Conteúdo do primeiro post' },
        { userId: 1, id: 2, title: 'Segundo Post', body: 'Conteúdo do segundo post' },
      ],
    }).as('allPosts');

    cy.intercept('POST', '**/posts*', {
      statusCode: 201,
      body: {
        userId: 1,
        id: 101,
        title: 'Leptos Post',
        body: 'Leptos Framework Web.',
      },
    }).as('createPost');

    cy.intercept('PUT', 'https://jsonplaceholder.typicode.com/posts/*', {
      statusCode: 200,
      body: {
        userId: 1,
        id: 1,
        title: 'Primeiro Post Editado',
        body: 'Conteúdo atualizado via Cypress.',
      },
    }).as('updatePost');

    cy.intercept('DELETE', 'https://jsonplaceholder.typicode.com/posts/*', {
      statusCode: 200,
      body: {},
    }).as('deletePost');
  });

  it('You must fill out the form and create a post.', () => {
    cy.visit('/create-post');

    cy.get('[data-cy="postForm.title"]').type('Leptos Post');
    cy.get('[data-cy="postForm.body"]').type('Leptos Framework Web.');

    cy.get('[data-cy="btn-submit"]').click();

    cy.wait('@createPost');

    cy.get('[data-cy="post-card"]').first().should('contain.text', 'Leptos Post');

    cy.contains('Primeiro Post').should('be.visible');
    cy.contains('Segundo Post').should('be.visible');
  });

  it('You must open the edit modal and update a post.', () => {
    cy.visit('/');

    cy.get('[data-cy="post-card"]').first().find('[data-cy="edit-btn"]').click();

    cy.get('[data-cy="modal-content"]')
      .should('be.visible')
      .within(() => {
        cy.get('#edit-title').should('be.visible').clear().type('Primeiro Post Editado');
        cy.get('#edit-body').should('be.visible').clear().type('Conteúdo atualizado via Cypress.');

        cy.get('[data-cy="btn-submit"]').click();
      });

    cy.wait('@updatePost');

    cy.get('[data-cy="post-card"]')
      .first()
      .should('contain.text', 'Primeiro Post Editado')
      .should('contain.text', 'Conteúdo atualizado via Cypress.');

    cy.get('[data-cy="modal-content"]').should('not.exist');
  });

  it('You must remove a post from the list.', () => {
    cy.visit('/');

    cy.get('[data-cy="post-card"]').eq(1).find('[data-cy="remove-btn"]').click();

    cy.wait('@deletePost');

    cy.contains('Segundo Post').should('not.exist');
  });
});
