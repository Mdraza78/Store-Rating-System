# Store Rating App

A full-stack web application that allows users to rate registered stores. The app supports three types of users with distinct roles:

- **Admin**: Can add new stores, view the total number of users, and manage the platform.
- **User**: Can search for stores and rate them on a scale of 1 to 5.
- **Store Owner**: Can view the ratings and feedback for their own store.

This project uses a modern tech stack of PostgreSQL (Neon) for the database, Express and Node.js for the backend API, and React for the frontend user interface.

---

## Features

- Role-based access control for Admin, Users, and Store Owners.
- Store registration and management by Admin.
- Store search and rating submission by Users.
- Rating overview accessible to Store Owners.
- Secure environment variable management.

---

## Tech Stack

- **Database:** PostgreSQL (Neon)
- **Backend:** Node.js, Express.js
- **Frontend:** React.js

---

## Installation and Setup

### Backend

1. Navigate to the backend directory:
2. Create a `.env` file to configure your environment variables (e.g., database connection URL, JWT secret).
3. Install dependencies with command: npm install


### Frontend

1. Navigate to the frontend directory:
2. Install dependencies: npm install
3. Start the React development server: npm start

