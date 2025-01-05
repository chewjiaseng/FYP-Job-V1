describe('Apply for a Job - SeekerHome Test (Direct Access)', () => {
  beforeEach(() => {
    // Mock login by setting localStorage/sessionStorage
    cy.window().then((window) => {
      window.localStorage.setItem('isAuthenticated', 'true');
      window.sessionStorage.setItem('username', 'user');
      window.localStorage.setItem('userRole', 'Job Seeker');
    });

    // Mock the /getjobs API response with job data
    cy.intercept('GET', '/getjobs', {
      statusCode: 200,
      body: [
        {
          id: 1,
          job_name: 'Software Developer',
          company: 'Tech Corp',
          location: 'Remote',
          salary: '50,000 USD',
          job_category: 'Development',
          working_place: 'Remote',
          working_hours: '40 hours/week',
          provider_name: 'Tech Corp',
          phone_num: '+1234567890',
          created_at: '2025-01-01 12:00:00',
        },
      ],
    }).as('getJobs');

    // Mock the /apply API response to simulate a successful job application
    cy.intercept('POST', '/apply', {
      statusCode: 200,
      body: { message: 'Application successful' },
    }).as('applyJob');

    // Visit the SeekerHome page directly
    cy.visit('/seeker-home');
  });

  it('should apply for a job successfully', () => {
    // Wait for the intercepted request
    cy.wait('@getJobs');

    // Verify the job card is displayed
    cy.contains('Software Developer').should('be.visible');

    // Click the Apply button for the job
    cy.contains('Apply').click();

    // Fill in the application form
    cy.contains('Name') // Find the label
    .parent() // Go to the parent v-text-field
    .find('input') // Find the input inside the v-text-field
    .type('user'); // Type the username    cy.get('input[label="Identification Card"]').type('A123456789');

    cy.contains('Identification Card') // Find the label
    .parent() // Go to the parent v-text-field
    .find('input') // Find the input inside the v-text-field
    .type('011');

     // Open the gender dropdown and select "Male"
  cy.get('.v-select') // Target the gender select field
  .click(); // Open the dropdown

cy.get('.v-list-item') // Target the dropdown list items
  .contains('Male') // Select the "Male" option
  .click(); // Click to select "Male"

    cy.contains('HP Number') // Find the label
        .parent() // Go to the parent v-text-field
        .find('input') // Find the input inside the v-text-field
        .type('01112345678'); // Type the username
    
        cy.get('input[type="file"]').attachFile('resume.pdf', { allowEmpty: true });

    // Mock the POST request for job application submission
    cy.intercept('POST', '/apply', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Application submitted successfully',
      },
    }).as('applyJob');

    // Submit the application form
    cy.contains('Send').click();

    // Wait for the application submission request
    cy.wait('@applyJob');

    // Verify the success snackbar message
    cy.contains('You have successfully applied for the part-time job', { timeout: 10000 })
    .should('be.visible');
    });
});
