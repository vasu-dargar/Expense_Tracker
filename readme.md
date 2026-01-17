Managing daily expenses manually often leads to poor tracking and difficulty in reviewing prior spendings.

This application provides a centralized platform where users can securely record, manage, and export their personal expenses.

Tech Stack Used -
---------------

Frontend -
React.js (Vite)
React Router DOM
Zod (form validation)
Fetch API

Backend -
Node.js
Express.js
MongoDB
JSON Web Tokens (JWT)
Node.js Streams

Other Tools -
Nodemon (development)
dotenv (environment configuration)

Detailed Folder Structure -
-------------------------

Overall -
-------

expense-tracker-mern/
|
├── backend/
├── frontend/
├── node_modules/
└── package.json
└── Readme.md

Backend -
-------

backend/
│
├── data/
│   ├── db/                # User data
├── node_modules/
|── src/
│   ├── config/            # Database configuration
|   ├── controllers/       # HTTP request handling
│   ├── middlewares/       # Auth, logging, error handling
|   ├── models/            # Mongoose schemas
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic layer
│   └── utils/             # Helpers and custom errors
|   ├── server.js          # Application entry point
|
├── .env                   # Environment variables
└── package.json

Frontend -
--------

frontend/
│
├── node_modules/
├── public/                # Configuration file for Vite
├── src/
│   ├── api/               # API communication layer
|   ├── assets/            # Configuration file for React
│   ├── auth/              # Authentication context & guards
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route-level pages
│   ├── utils/             # Formatters and constants
│   ├── App.jsx            # Routing configuration
|   ├── config.js          # Configurations
│   └── main.jsx           # React entry point
│
├── .env                   # Frontend environment variables
├── index.html
└── package.json

Authentication Flow Explanation -
-------------------------------

1 - User signs up or logs in using email and password.
2 - Backend verifies credentials and generates a JWT token.
3 - Token is sent to the frontend and stored securely in localStorage.
4 - For every protected request, token is sent in the Authorization header.
5 - Backend middleware validates the token; if valid, request proceeds; if expired/invalid → access denied (401).
6 - Users can only access and modify their own expense data.

This ensures secure, isolated, and authenticated access throughout the application.

Streaming Use Case Explanation -
------------------------------

1 - The application uses Node.js streams to export expense data as a CSV file.

Utility of streaming -
- Expense data can be large.
- Loading all records into memory at once is inefficient.

How it works -
- MongoDB cursor streams expense records one by one.
- Each record is written into a CSV stream.
- Data is sent progressively to the client.
- Frontend consumes the stream chunk-by-chunk and shows download progress.

Benefits -
- Low memory usage
- Faster response for large datasets
- Real-world scalable export solution

How to run the application -
--------------------------

1 - Run MongoDB instance setting desired path to data (db) folder -
"<path-to-mongod.exe-file>" --dbpath "<desired-path-to-\data\db-folder>"

2 - Install concurrently using -
npm install concurrently --save-dev

3 - Run application using -
npm run dev
