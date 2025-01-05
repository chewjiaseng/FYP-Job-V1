describe('Login Test', () => {
    beforeEach(() => {
      // Visit the login page before each test
      cy.visit('/login');
    });
  
    it('successfully logs in with valid credentials', () => {
      // Enter the username (user)
      cy.contains('Username / E-mail') // Find the label
        .parent() // Go to the parent v-text-field
        .find('input') // Find the input inside the v-text-field
        .type('user'); // Type the username
  
      // Enter the password (user123)
      cy.contains('Password') // Find the label
        .parent() // Go to the parent v-text-field
        .find('input') // Find the input inside the v-text-field
        .type('user123'); // Type the password
  
      // Select the role as 'Job Seeker'
      cy.get('.role-select') // Target the select field for the role
        .click(); // Open the dropdown
      cy.get('.v-list-item') // Ensure you target the correct dropdown option
        .contains('Job Seeker') // Find the "Job Seeker" role
        .click(); // Select the "Job Seeker" role
  
      // Wait for the login request to complete
      cy.intercept('POST', '/login').as('loginRequest'); // Intercept the login POST request
      cy.get('.login-button') // Target the login button by its class
        .click();
      
      // Wait for the login request to finish
      cy.wait('@loginRequest');
  
      // Ensure that the user is redirected to the correct page after login
      cy.url().should('include', '/seeker-home'); // Adjust with the correct URL
      cy.window().its('localStorage.isAuthenticated').should('eq', 'true'); // Ensure authentication status is set in localStorage
      cy.window().its('sessionStorage.username').should('eq', 'user'); // Ensure username is stored in sessionStorage
    });
  });
  