describe('Management Posts CRUD', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('You must fill out the form and create a post.', () => {
    cy.visit('/create-post');

    cy.get('[data-cy="postForm.title"]').type('Angular Post');
    cy.get('[data-cy="postForm.body"]').type('Angular Framework Web.');

    cy.get('[data-cy="btn-submit"]').click();
  });
});
