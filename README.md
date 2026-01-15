
StoreRateApp.
A full-stack web application designed for users to rate and review registered stores. The platform provides a multi-role ecosystem for customers, store owners, and system administrators to manage feedback and performance insights.


Tech Stack

Frontend: ReactJs 


Backend: Node.js with ExpressJs 


Database: PostgreSQL (Neon)

Styling: Custom CSS with a modern dark theme and glassmorphic components.

Core Features
System Administrator

Dashboard: Real-time metrics for total users, stores, and submitted ratings.


User Management: Create and manage accounts for normal users and admins.



Store Management: Register new stores into the ecosystem.


Data Oversight: Filter and view comprehensive details of all platform participants.

Store Owner

Performance Tracking: Access average store ratings.


Engagement: View list of users who have submitted ratings for their specific store.


Security: Self-service password updates and secure logout.


Normal User

Discovery: Browse and search for stores by name or address.


Rating System: Submit or modify 1-5 star ratings for individual stores.



Onboarding: Seamless registration and login functionality.

System Requirements & Validations
To ensure data integrity, the application enforces the following standard validations:


Name: Minimum 20 and maximum 60 characters.


Address: Maximum 400 characters.


Password: 8-16 characters, requiring at least one uppercase letter and one special character.


Email: Strict adherence to standard email validation patterns.


Tables: Full support for ascending and descending sorting on key fields.

Visual Overview
Main Dashboard
Store Management
User Listings
Installation and Setup
Prerequisites
Node.js installed

PostgreSQL database instance

Database Setup
Create a database named store_rating_db.

Execute the schema provided in the /backend/config folder to set up tables.

Backend Setup
Navigate to the backend directory.

Install dependencies:

Bash

npm install
Create a .env file and configure your database credentials:

Code snippet

PORT=5000
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=store_rating_db
JWT_SECRET=your_secret_key
Start the server:

Bash

npm start
Frontend Setup
Navigate to the frontend directory.

Install dependencies:

Bash

npm install
Start the application:

Bash

npm start
