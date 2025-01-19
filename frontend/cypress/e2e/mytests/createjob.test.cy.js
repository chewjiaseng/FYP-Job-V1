describe('Job Creation Test', () => {
    it('should display success message when job is created successfully', () => {
      // Visit the page containing the job creation form
      cy.visit('/create-job');  // Replace with your actual route
  
      // Fill out the form fields
      cy.contains('Job Name')
        .parent()
        .find('input')
        .type('Frontend Developer');
  
      cy.contains('Job Category')
        .parent()
        .find('input')
        .type('Information Technology');
  
      cy.contains('Salary')
        .parent()
        .find('input')
        .type('5000');
  
      cy.contains('Working Place')
        .parent()
        .find('input')
        .type('Remote');
  
      cy.contains('Working Hours')
        .parent()
        .find('input')
        .type('40 hours');
  
      cy.contains('Phone Number')
        .parent()
        .find('input')
        .type('1234567890');
  
      cy.contains('Job Description')
        .parent()
        .find('textarea')
        .type('Job description goes here...');
  
        cy.intercept('POST', '**/create-job', {
            statusCode: 200,
            body: { message: 'Job created successfully!' },
          }).as('createJob');
          
          cy.get('.create-button').click();
          cy.wait('@createJob'); // Wait for the API call
          cy.get('.success-banner').should('contain', 'Job created successfully!');
  
    });
    it('should display error message when required fields are empty', () => {
        // Visit the job creation page
        cy.visit('/create-job'); // Replace with your actual route
    
        // Click the "Create" button without filling any fields
        cy.get('.create-button').click(); // Replace with the correct selector for your "Create" button
    
        // Check if the error message is displayed
        cy.get('.success-banner')
          .should('be.visible') // Ensure the banner is visible
          .and('contain', 'Please fill in the information!'); // Verify the correct error message
      });
  });
  