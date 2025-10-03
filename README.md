# Chat App

## Project Summary

This Chat App is a full-stack real-time messaging platform built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for instant one-on-one communication. It allows users to sign up, log in, and chat directly with other users in private conversations with real-time updates. The app is designed to be responsive across devices and prioritizes a user-friendly experience for quick and easy conversations.

## Key Features

- Real-time one-on-one chat with instant message delivery using Socket.io
- Secure user authentication with JWT-based sessions
- See online/offline user status
- Responsive UI optimized for desktops and mobile devices
- Deployed on Vercel for easy access and scalability

## Tech Stack

- **MongoDB** - Database
- **Express.js** - Backend framework
- **React.js** - Frontend library
- **Node.js** - Server runtime
- **Socket.io** - Real-time communication
- **Vercel** - Deployment platform

## Live Demo

[Chat App Live](https://chat-app-1ifm.vercel.app/)

## Installation

### 1. Clone the repository:


git clone https://github.com/kanishkmishra-afk/Chat-App.git

### 2. Install backend dependencies:

cd backend
npm install


### 3. Create a `.env` file in the backend directory with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


### 4. Install frontend dependencies:

cd ../frontend
npm install


### 5. Start the backend server:

npm start


### 6. Start the frontend server:

npm start


### 7. Open `http://localhost:3000` in your browser.


## Usage

- Sign up or log in to the app
- Create new chat rooms or join existing ones
- Start real-time messaging
- See who is online
- Log out when finished

