# Salesforce Connection Status Project

This project allows you to connect to Salesforce using an endpoint and check the status of the deployment. In case of any errors, there is a job that runs periodically to validate if any errors occurred during the deployment.

## Installation

1. Clone the repository to your local machine.
2. Run the command `npm install` to install the project dependencies.

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variable to the `.env` file:

    - GITLAB_TOKEN

## Usage

1. Run the command `npm start` to start the project.
2. Access the provided endpoint to send the connection data to Salesforce.
3. The project will automatically check the deployment status, and if any errors occur, a job will run periodically to validate if there are any errors.

## GitLab Integration

After the deployment process is completed on Salesforce, the project automatically comments on GitLab with the status of the deployment, indicating whether it was successful or failed.

## Error Details

In case of a failed deployment, the project retrieves the error details and generates a table using Markdown to display the errors. The table will include relevant information such as error codes, descriptions, and any additional details available.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your contribution: `git checkout -b my-contribution`.
3. Make the necessary changes and commit them: `git commit -m "My contribution"`.
4. Push your changes to the remote repository: `git push origin my-contribution`.
5. Open a pull request for review.

## License

This project is licensed under the [Apache License](link-to-license).

Feel free to reach out if you have any further questions.


