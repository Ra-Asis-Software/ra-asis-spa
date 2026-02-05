# Ra'Analytica Web Application

## Project Overview

Ra'Analytica is a MERN-based Learning Progress Analytics web application designed to enhance learning experiences through real-time insights, personalized feedback, and efficient activity management. The platform supports students, teachers, parents/guardians, and administrators by providing role-based dashboards, analytics, assessments, and communication tools to promote engagement and academic growth.

### Product Goal:

The goal of this product is to provide a comprehensive Learning Progress Analytics platform that enhances a user's learning experience by providing real-time insights, personalized feedback, and efficient management of student/learner activities. The platform should ensure that all stakeholders (students/learners, teachers/tutors, parents/guardians, and administrators) are well-informed and actively engaged.

### Key Features

- **User Management**: Secure authentication and account management for different types of users (Students, Teachers, Parents/Guardians, and Administrators).
- **Activity Dashboards**: Role-based dashboards for tracking key activities and progress.
- **Assessment Management**: Teachers can create, grade, and manage assignments and quizzes.
- **Student Analytics**: Advanced analytics to monitor performance at both individual and group levels.
- **Progress Reports**: Customizable and downloadable progress reports.
- **Notes & Resources**: Ability for students to manage notes and teachers to upload worksheets.
- **Reminder Notifications**: Task reminders for users to stay organized.
- **Teacher Feedback**: Teachers can provide feedback through text-based messages and real-time chat.
- **Notification and Alerts System**: Alerts and notifications for all significant activities.
- **Automatic Activity Time Tracking**: Time tracking of student activities for productivity insights.
- **Group Collaboration**: Peer collaboration on assignments and tasks.
- **Rewards Management**: Badge-based rewards to recognize student achievements.
- **Attendance Tracking**: Track student attendance manually or automatically.

## Table of Contents

1. Prerequisites
2. Installation
3. Environment Setup
4. Running The Application
5. Usage
6. Build For Production
7. Technologies Used
8. License

## Prerequisites

To run this project locally, you'll need to have the following installed:

- **Node.js** (v16+ recommended)
- **npm** (v8+ recommended)
- **MongoDB** (v4.4+)
- **MongoDB Shell (mongosh)**
- **Git**

### Verify Installation

---bash

node -v
npm -v
mongod --version
git --version

## Installation

### Clone the repository:

---bash

git clone https://github.com/Ra-Asis-Software/ra-asis-spa.git
cd ra-asis-spa

### Install Back-End Dependencies

---bash

cd server
npm install

### Install Front-End Dependencies

Open a new terminal:

---bash

cd client
npm install

## Environment Setup

### Back-End Environment

Set up environment variables: Create a .env file in the server directory and include the following:

/server/.env

MONGO_URI=mongodb://localhost:27017/ra_asis_spa
PORT=5000
JWT_SECRET=your_strong_secret_key
NODE_ENV=development
EMAIL_USERNAME=your_email@example.com
EMAIL_PASSWORD=your_email_password
INQUIRY_EMAIL=receiver_email@example.com

Replace all placeholder values above with your actual credentials.

Run MongoDB: Start the MongoDB service locally by running:

#### Linux (Systemd)

---bash

sudo systemctl start mongod
sudo systemctl status mongod `check status`

#### Windows

---bash

mongod

#### macOS (Homebrew)

---bash

brew services start mongodb-community

## Running The Application (Dev Mode)

You must run both backend and frontend servers.

### Start Back-End Server

From /server:

npx nodemon server.js

or

npm run dev

or

npm start

Backend runs on:
http://localhost:5000

### Start Front-End Server

From /client:

npm run dev

Frontend runs on:
http://localhost:5173

Run this on your browser

## Usage

This application is designed to cater to four types of users: Students also referred to as Learners, Teachers also referred to as Tutors, Parents also referred to as Guardians, and Administrators. Based on their roles, users have access to different functionalities.

- Students can view their activity dashboards, receive feedback, track their progress, and collaborate on tasks.
- Teachers can manage assessments, view their analytics, view student analytics, and provide feedback.
- Parents/Guardians can monitor their child’s academic progress and receive important notifications.
- Administrators manage users and the overall system.

## Building For Production

### Build Frontend

From /client:

npm run build

Production files will be generated in:

client/dist

### Backend Production Mode

Update /server/.env:

NODE_ENV=production

and other necessary variables

Then run:

npm start

### Common Scripts

#### Backend (/server)

npm run dev - Start with Nodemon
npm start - Start production server

#### Frontend (/client)

npm run dev - Start dev server
npm run build - Build for production
npm run preview - Preview build
npm run lint - Run ESLint

## Technologies Used

- Frontend: React 19, Vite
- Backend: Node.js, Express.js
- Database: MongoDB & Mongoose
- Authentication: JWT-based authentication
- Styling: CSS Modules

## License

This project is licensed under the MIT License. See the LICENSE file for details.
