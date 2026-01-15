# **StoreRate.**

A professional full-stack web application developed for the FullStack Intern Coding Challenge.This platform provides a comprehensive ecosystem where users can submit ratings for registered stores, owners can monitor their business performance, and system administrators can oversee the entire platform through data-driven insights.

## Tech Stack

* **Frontend:** ReactJs 
* **Backend:** Node.js with ExpressJs 
* **Database:** PostgreSQL (Hosted on Neon) [

## User Roles and Functionalities

### 1. System Administrator
* **Analytics Dashboard:** Monitor total numbers of users, registered stores, and submitted ratings
* **Management:** Add new stores and create accounts for administrators or normal users.
* **Listings & Filters:** View detailed lists of all stores and users with advanced filtering by Name, Email, Address, and Role.

### 2. Store Owner
* **Owner Metrics:** View the average rating of their specific store.
* **Feedback Tracking:** See a list of specific users who have provided feedback and ratings for their store.
* **Security:** Access to password update tools and secure session management.

### 3. Normal User
* **Store Discovery:** Search and browse all registered stores by Name or Address.
* **Interaction:** Submit new ratings (1 to 5 stars) or modify previously submitted ratings.
* **Account Management:** Self-service registration and password modification.

## System Validations

The application enforces the following strict validation rules:
* **Name:** Minimum 20 characters and Maximum 60 characters.
* **Address:** Maximum 400 characters.
* **Password:** 8-16 characters, including at least one uppercase letter and one special character.
* **Email:** Standard email format validation.

## Visual Overview

### Main Dashboard
<img width="1919" height="820" alt="image" src="https://github.com/user-attachments/assets/9ea876af-1d69-4afd-b811-c6e0d3396f6a" />

### SigIn Page
<img width="1744" height="800" alt="image" src="https://github.com/user-attachments/assets/5207a26f-765a-486e-aee5-63cd21eb6a4a" />

### Registeration Page
<img width="1573" height="807" alt="image" src="https://github.com/user-attachments/assets/39c9e8d8-6c0c-4b3c-b8f8-4d9d554dd317" />


### Store Owner Dashboard
<img width="1918" height="828" alt="image" src="https://github.com/user-attachments/assets/7f247a51-d658-4ede-abb0-867ed2fb9f6e" />
<img width="1919" height="830" alt="image" src="https://github.com/user-attachments/assets/fc806e9e-a6d6-4c03-a48e-a874d479983f" />
<img width="1003" height="778" alt="image" src="https://github.com/user-attachments/assets/c02419c8-39a8-444a-ae0b-4a733ada5c1f" />
<img width="1067" height="730" alt="image" src="https://github.com/user-attachments/assets/01300d65-b45c-4ec1-be7a-92a9a7e13893" />

### Normal User Dashboard
<img width="1919" height="816" alt="image" src="https://github.com/user-attachments/assets/ff55fb72-fa95-42d5-a1f1-cd2d4907404b" />
<img width="1919" height="813" alt="image" src="https://github.com/user-attachments/assets/795edfe9-996a-457d-854f-e9c26b265bc0" />
<img width="1919" height="827" alt="image" src="https://github.com/user-attachments/assets/6338afe8-ac4a-462e-82dc-e8cae61c0748" />

### Admin Dashboard

<img width="1917" height="828" alt="image" src="https://github.com/user-attachments/assets/8b0f6657-afbb-48fc-934a-addecd03b41e" />
<img width="1919" height="819" alt="image" src="https://github.com/user-attachments/assets/7e8d26d9-4ae9-4510-af18-7c204608eada" />
<img width="1919" height="819" alt="image" src="https://github.com/user-attachments/assets/18a85836-d03f-47e3-a0de-bd53d9e116f4" />
<img width="1819" height="771" alt="image" src="https://github.com/user-attachments/assets/be93c7f0-de45-4a77-8196-1f0eda6a9197" />


## Installation and Setup

### Prerequisites
* Node.js (v14+)
* PostgreSQL Database (Neon)

### Database Configuration
1.  Create a new project in the **Neon** console.
2.  Use the SQL Editor in Neon to execute the schema located in `/backend/config` to build the required tables.
3.  Copy your connection string from the Neon dashboard.

### Backend Setup
1.  Navigate to the `backend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the backend root:
    ```env
    PORT=5000
    DATABASE_URL=your_neon_connection_string
    JWT_SECRET=your_secret_key
    ```
4.  Start the server:
    ```bash
    nodemon server.js
    ```

### Frontend Setup
1.  Navigate to the `frontend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React application:
    ```bash
    npm start
    ```

## Author
Md Raza
Internship Coding Challenge Submission
