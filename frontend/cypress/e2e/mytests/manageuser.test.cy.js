describe('Manage User Data - Add User Test', () => {
    beforeEach(() => {
      cy.visit('/manage-user-data'); // Visit the page
    });
  
    it('should successfully select a role and add a user', () => {
      // Open the Add User Dialog
      cy.get('.add-button').click();
      cy.get('.v-dialog').should('be.visible'); // Ensure the dialog is visible
  
      // Fill in the Username field
      cy.get('.v-dialog').within(() => {
        // cy.contains('Username')
        //   .closest('.v-input')
        //   .find('input')
        //   .type('newuser');
  
        // // Fill in the Email field
        // cy.contains('Email')
        //   .closest('.v-input')
        //   .find('input')
        //   .type('newuser@example.com');
  
        // // Fill in the Password field
        // cy.contains('Password')
        //   .closest('.v-input')
        //   .find('input')
        //   .type('securepassword');

       // Open the dropdown and select "Job Seeker"
    cy.get('.v-select').click(); // Open the dropdown
    cy.get('.v-overlay--active').find('.v-list-item').contains('Job Seeker').click(); // Select "Job Seeker"
      });
  
      // Click the Add button
      cy.contains('Add').click();
  
      // Verify Snackbar Notification
      cy.get('.v-snackbar')
        .should('be.visible')
        .and('contain.text', 'User added successfully!');
    });
  });
  