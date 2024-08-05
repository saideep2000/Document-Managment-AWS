# DocuFlow: Document Management System

**DocuFlow** is a state-of-the-art document management application designed to streamline efficiency and collaboration. Leveraging robust technologies like AWS services and React, DocuFlow provides a responsive and secure environment for managing files with ease.

## Features

### Real-Time Uploads and Notifications
- Utilizes AWS WebSocket for instant file updates and notifications.

### Secure User Authentication
- Implements JWT for secure, token-based user authentication to manage sessions and data access securely.

### High Scalability
- Scales seamlessly with AWS Lambda's serverless architecture, handling increases in data volume effortlessly.

### Comprehensive User Management
- Detailed user profiles and management features enable effective tracking and management of user activity.

## Technology Stack

- **Frontend**: React for a dynamic and interactive user experience.
- **Backend**: Serverless processing with AWS Lambda for handling backend logic.
- **Storage**: AWS S3 for secure and durable file storage.
- **Database**: Amazon DynamoDB for fast data retrieval and management.

## System Architecture

Below is the architecture diagram illustrating the interaction between different components of DocuFlow:

![Architecture Diagram](assets/Architecture.png)
*Figure 1: System Architecture Diagram*

## User Interface

The user interface is crafted to be intuitive, providing users with easy navigation and accessibility:

![UI Flow Diagram](assets/page.png)
*Figure 2: User Interface Flow Diagram*

## Getting Started

To begin using DocuFlow, clone the repository and follow the setup instructions provided in the README file. Ensure your AWS credentials are configured properly to interact with the AWS services used by the application.

## Frontend Setup Guide

```bash
git clone https://github.com/saideep2000/Document-Managment-AWS
cd DocuFlow
cd frontend
npm install
npm start
```
## Backend Setup Guide

To ensure the DocuFlow application functions correctly, it is essential to properly configure the AWS Lambda functions, Amazon S3 buckets, and Amazon DynamoDB tables. Follow these detailed steps to set up your backend infrastructure:

### AWS Lambda Functions
1. **Create Lambda Functions**: Ensure all necessary Lambda functions are defined as per your application's requirements.
2. **Assign Permissions**: Attach appropriate IAM roles to each Lambda function. These roles should have policies granting access to other AWS services like S3 and DynamoDB as needed by your functions.
3. **Environment Variables**: Set environment variables in your Lambda functions, including the S3 bucket name and DynamoDB table names, to ensure consistency across your application.

### Amazon S3 Bucket Configuration
1. **Create S3 Bucket**: Ensure that the S3 bucket used for storing files is correctly created.
2. **Set Bucket Policy**: Apply the necessary bucket policy that aligns with your application's access requirements for file uploads and retrieval.
3. **Configure CORS**: Set up CORS (Cross-Origin Resource Sharing) on your S3 bucket to allow your web application to interact with the bucket from different domains.
4. **Verify Bucket Name**: Double-check that the bucket name in your Lambda configuration matches the actual S3 bucket name to avoid connection issues.

### Amazon DynamoDB Setup
1. **Create DynamoDB Tables**: Set up two tables in DynamoDB:
   - **User Table**: To store user information.
   - **User Files Table**: To keep records of user files and metadata.
2. **Define Primary Keys**: Ensure each table has the appropriate primary keys as required by your Lambda functions for efficient data access.
3. **Update Lambda Configuration**: Verify that the table names in your Lambda functions match the names used during table creation.

### Validation Steps
- After setting up your backend infrastructure, perform tests to validate that your Lambda functions can access S3 and DynamoDB resources without permissions issues.
- Check the Lambda function logs in CloudWatch to troubleshoot and resolve any errors related to permissions or resource access.

### Deployment Notes
- Deploy changes incrementally and verify functionality through unit tests and integration tests.
- Consider using AWS CloudFormation or Terraform for infrastructure as code solutions to automate and manage deployments more effectively.

By following these detailed steps, you can ensure that your backend setup for DocuFlow is robust and ready to handle the application's requirements efficiently.



## Frontend Steps Followed:

npx create-react-app frontend

cd frontend

npm install aws-amplify @aws-amplify/ui-react

src/aws-exports.js

npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p

edit src/index.css to include Tailwind Directives

edit tailwind.config.js

npm install react-router-dom

npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome

npm install aws-amplify @aws-amplify/auth


https://<your domain>/oauth2/authorize?response_type=code&client_id=<your app client id>&redirect_uri=<your callback url>

https://https://docu-flow.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=code&client_id=MyAppClient&redirect_uri=https://localhost

https://docu-flow.auth.us-east-1.amazoncognito.com/login?client_id=3m2rmnn8qc1mkoa78gd0ln53ga&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Flocalhost

npm install -g @aws-amplify/cli

npm install dotenv

npm install axios

npm install redux react-redux redux-thunk

src/store/index.js basic Redux store

src/store/authReducer.js Create a file for the auth reducer which will handle actions related to auth

src/store/authActions.js actions for handling login, signup, and logout functionalities

src/index.js to include the Redux provider


npm install redux-persist



## Backend

