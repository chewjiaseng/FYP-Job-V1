describe('AI Recommendation Feature', () => {
    beforeEach(() => {
        // Mock login by setting localStorage/sessionStorage
        cy.window().then((window) => {
            window.localStorage.setItem('isAuthenticated', 'true');
            window.sessionStorage.setItem('username', 'testUser');
            window.localStorage.setItem('userRole', 'Job Seeker');
        });

        // Intercept the request and fake the response for resume upload
        cy.intercept('POST', '/jobs', (req) => {
            // Simulating the AI recommendation response
            req.reply({
                statusCode: 200,
                body: {
                    predictedCategory: 'Information Technology', // Example predicted category
                    recommendedJob: 'Frontend Developer',   // Example recommended job
                },
            });
        }).as('uploadResumeRequest');

        // Visit the page directly after the mock login
        cy.visit('/job-recommendation');
    });

    it('uploads a resume and shows the predicted category, job, and a dummy job', () => {
        // Mock the backend response for predicted category and recommended job
        cy.intercept('POST', '/jobs', {
            statusCode: 200,
            body: {
                predicted_category: 'Information Technology',
                recommended_job: 'Frontend Developer',
                jobs: [
                    {   // Dummy job data
                        id: 1,
                        job_name: 'Frontend Developer',
                        job_category: 'Information Technology',
                        working_place: 'Remote',
                        working_hours: 'Full-time',
                        job_description: 'Develop and maintain the front-end of web applications.',
                        created_at: '2025-01-19',
                        provider_name: 'Tech Corp',
                        phone_num: '123-456-7890',
                    },
                ],  // Simulate a job available under the predicted category
                message: '',  // Ensure there's no error message here
            },
        }).as('resumeUpload');

        // Simulate the resume upload
        cy.get('input[type="file"]').attachFile('myresume.pdf');
        cy.get('button[type="submit"]').click();

        // Wait for the request to finish
        cy.wait('@resumeUpload', { timeout: 8000 });  // Increase timeout if needed


        // Check if the dummy job is displayed in the UI
        cy.contains('Frontend Developer').should('be.visible');
        cy.contains('Information Technology').should('be.visible');
        cy.contains('Remote').should('be.visible');
        cy.contains('Full-time').should('be.visible');
        
        // Ensure the "No jobs found" error is not shown
    });

    it('should show an error if the file is not uploaded or invalid', () => {
        // Mock the backend response for an invalid resume upload
        cy.intercept('POST', '/jobs', {
            statusCode: 400, // Simulate a bad request
            body: {
                message: 'The uploaded file does not appear to be a valid resume.',
            },
        }).as('resumeUploadError');
    
        // Simulate the resume upload (you can also use an invalid file type here if needed)
        cy.get('input[type="file"]').attachFile('myresume.pdf'); // Simulate invalid resume file
        cy.get('button[type="submit"]').click();
    
        // Wait for the request to finish
        cy.wait('@resumeUploadError', { timeout: 8000 });
    
        // Verify that the error message for an invalid file is shown
        cy.contains('The uploaded file does not appear to be a valid resume.').should('be.visible');
    });
    
    it('should show an error if no file is uploaded and submit is clicked', () => {
        // Try submitting the form without uploading a file
        cy.get('button[type="submit"]').click();
        
        // Verify that the error message "Please upload a file" is displayed
        cy.contains('Please upload a file').should('be.visible');
    });
    
});
