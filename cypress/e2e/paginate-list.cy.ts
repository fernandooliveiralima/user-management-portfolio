describe('Pagination Component (PaginateList E2E)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/posts*', {
      statusCode: 200,
      body: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1}`,
        body: `Content Post ${i + 1}`,
      })),
    }).as('getPosts');

    cy.visit('/');
  });

  describe('Initial Rendering and Page Count', () => {
    it('should render the correct number of page buttons', () => {
      cy.get('[data-cy="pagination-container"]').should('be.visible');
      cy.get('[data-cy="page-button"]').should('have.length', '10');
    });

    it('It should disable the first-page button by default (active page).', () => {
      cy.get('[data-cy="page-button"]').first().should('be.disabled');
    });

    it('It should only display the first 10 items on page 1.', () => {
      cy.get('[data-cy="post-card"]').should('have.length', 10);
      cy.get('[data-cy="post-card"]')
        .first()
        .should(
          'contain.text',
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        );
      cy.get('[data-cy="post-card"]').last().should('contain.text', 'optio molestias id quia eum');
    });
  });

  describe('Navigation and Click Events', () => {
    it('It should switch to page 2 when clicking the second pagination button.', () => {
      cy.get('[data-cy="page-button"]').eq(1).click();

      cy.get('[data-cy="page-button"]').eq(1).should('be.disabled');
      cy.get('[data-cy="page-button"]').eq(0).should('not.be.disabled');

      cy.get('[data-cy="post-card"]').should('have.length', 10);
      cy.get('[data-cy="post-card"]')
        .first()
        .should('contain.text', 'et ea vero quia laudantium autem');
      cy.get('[data-cy="post-card"]')
        .last()
        .should('contain.text', 'doloribus ad provident suscipit at');
    });

    it('it should correctly load the last page with the remaining number of items', () => {
      cy.get('[data-cy="page-button"]').eq(2).click();

      cy.get('[data-cy="post-card"]').should('have.length', 10);
      cy.get('[data-cy="post-card"]')
        .first()
        .should('contain.text', 'asperiores ea ipsam voluptatibus modi minima quia sint');
      cy.get('[data-cy="post-card"]')
        .last()
        .should('contain.text', 'a quo magni similique perferendis');
    });

    it('It should not reload the list when clicking on the already selected page.', () => {
      cy.get('[data-cy="page-button"]').first().click({ force: true });

      cy.get('[data-cy="post-card"]').should('have.length', 10);
      cy.get('[data-cy="page-button"]').first().should('be.disabled');
    });
  });
});
