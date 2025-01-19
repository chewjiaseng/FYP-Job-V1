describe('Signup Functionality Test', () => {
    beforeEach(() => {
      // Visit the Signup page
      cy.visit('/signup');
    });
  
    it('should successfully register a new user', () => {
      // Intercept the POST /signup request and mock a successful response
      cy.intercept('POST', '/signup', {
        statusCode: 201,
        body: {
          success: true,
          message: 'User created successfully!',
        },
      }).as('signupRequest');
  
      // Fill in the signup form
      cy.contains('Username') // Locate the Username field
        .parent() // Go to the parent v-text-field
        .find('input') // Find the input inside the v-text-field
        .type('testuser');
  
      cy.contains('Email') // Locate the Email field
        .parent() // Go to the parent v-text-field
        .find('input') // Find the input inside the v-text-field
        .type('testuser@example.com');
  
      cy.contains('Password') // Locate the Password field
        .parent() // Go to the parent v-text-field
        .find('input') // Find the input inside the v-text-field
        .type('securepassword');
  
      // Open the dropdown first by clicking on the v-select
    cy.contains('Select Your Role') // Locate the label for the dropdown
    .parent() // Move to the parent v-select container
    .click(); // Click to open the dropdown

    // Wait for the dropdown items to appear and select the role
    cy.get('.v-list-item') // Target the dropdown items
    .contains('Job Seeker') // Find the specific option
    .click(); // Click to select the role 
  
      // Click the Register button
      cy.contains('Register').click();
      

     // Wait for the intercepted request and verify the response
    cy.wait('@signupRequest').its('response.statusCode').should('eq', 201);

    // Verify the success message is visible in the DOM
    cy.contains('Registration successful').should('be.visible');
    });
  
    it('should show an error if required fields are missing', () => {
      // Click the Register button without filling in the form
      cy.contains('Register').click();
  
      // Verify that the error message is visible in the DOM
  cy.contains('Please fill in all fields').should('be.visible');
    });
  
    it('should show an error for an already existing username', () => {
      // Intercept the POST /signup request and mock an error response for duplicate username
      cy.intercept('POST', '/signup', {
        statusCode: 400,
        body: {
          error: 'Username already taken. Please choose a different username.',
        },
      }).as('signupRequest');
  
      // Fill in the signup form with duplicate username
      cy.contains('Username')
        .parent()
        .find('input')
        .type('existinguser');
      cy.contains('Email')
        .parent()
        .find('input')
        .type('existinguser@example.com');
      cy.contains('Password')
        .parent()
        .find('input')
        .type('securepassword');
      // Open the dropdown first by clicking on the v-select
    cy.contains('Select Your Role') // Locate the label for the dropdown
    .parent() // Move to the parent v-select container
    .click(); // Click to open the dropdown

    // Wait for the dropdown items to appear and select the role
    cy.get('.v-list-item') // Target the dropdown items
    .contains('Job Seeker') // Find the specific option
    .click(); // Click to select the role
  
      // Click the Register button
      cy.contains('Register').click();
  
      // Wait for the intercepted request
      cy.wait('@signupRequest').its('response.statusCode').should('eq', 400);
  
      // Verify the error message
      cy.contains('Username already taken. Please choose a different username.').should('be.visible');
    });
  
    it('should show an error for an already existing email', () => {
      // Intercept the POST /signup request and mock an error response for duplicate email
      cy.intercept('POST', '/signup', {
        statusCode: 400,
        body: {
          error: 'Email already in use. Please choose a different email.',
        },
      }).as('signupRequest');
  
      // Fill in the signup form with duplicate email
      cy.contains('Username')
        .parent()
        .find('input')
        .type('newuser');
      cy.contains('Email')
        .parent()
        .find('input')
        .type('existinguser@example.com');
      cy.contains('Password')
        .parent()
        .find('input')
        .type('securepassword');
       // Open the dropdown first by clicking on the v-select
      cy.contains('Select Your Role') // Locate the label for the dropdown
      .parent() // Move to the parent v-select container
      .click(); // Click to open the dropdown

      // Wait for the dropdown items to appear and select the role
      cy.get('.v-list-item') // Target the dropdown items
      .contains('Job Seeker') // Find the specific option
      .click(); // Click to select the role 
    
  
      // Click the Register button
      cy.contains('Register').click();
  
      // Wait for the intercepted request
      cy.wait('@signupRequest').its('response.statusCode').should('eq', 400);
  
      // Verify the error message
      cy.contains('Email already in use. Please choose a different email.').should('be.visible');
    });
  });
  