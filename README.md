# Ra'Asis Student Progress Analytics Web Application

## Project Overview

### Product Goal:
The goal of this project is to develop a comprehensive Student Progress Analytics web application that enhances the learning experience by providing real-time insights, personalized feedback, and efficient management of student activities. The platform ensures that all stakeholders (students, teachers, parents/guardians, and administrators) are well-informed and actively engaged.

### Key Features

- **User Management**: Secure authentication and account management for different types of users (Students, Teachers, Parents/Guardians, and Administrators).
- **Activity Dashboards**: Role-based dashboards for tracking key activities and progress.
- **Assessment Management**: Teachers can create, grade, and manage assignments and quizzes.
- **Student Analytics**: Advanced analytics to monitor performance at both individual and group levels.
- **Progress Reports**: Customizable and downloadable progress reports.
- **Class and Coursework Notes**: Ability for students to manage notes and teachers to upload worksheets.
- **Reminder Notifications**: Task reminders for users to stay organized.
- **Teacher Feedback**: Teachers can provide feedback through text-based messages and real-time chat.
- **Notification and Alerts System**: Alerts and notifications for all significant activities.
- **Automatic Activity Time Tracking**: Time tracking of student activities for productivity insights.
- **Group Collaboration**: Peer collaboration on assignments and tasks.
- **Rewards Management**: Badge-based rewards to recognize student achievements.
- **Attendance Tracking**: Track student attendance manually or automatically.

## Table of Contents

1. Installation
2. Usage
3. Technologies Used
4. License

## Installation

### Prerequisites

To run this project locally, you'll need to have the following installed:

- Node.js (v14 or later)
- MongoDB (v4.4 or later)
- npm (v6 or later)
- Mongosh - MongoDB Shell for interacting with your MongoDB instance.

### Steps to Install

1. Clone the repository:

   ```bash
   git clone https://github.com/Ra-Asis-Software/ra-asis-spa.git
   cd ra-asis-spa

2. Install Dependencies

    bash
npm install

3. Set up environment variables: Create a .env file in the root directory and include the following:

MONGO_URI=mongodb://localhost:27017/ra_asis_spa
JWT_SECRET=your_secret_key
NODE_ENV=development

4. Run MongoDB: Start the MongoDB service locally by running:

mongod

5. Start the development server:

npm start

6. Access the application: Open your browser and go to:

http://localhost:3000


## Usage

This application is designed to cater to four types of users: Students, Teachers, Parents/Guardians, and Administrators. Based on their roles, users have access to different functionalities.

- Students can view their activity dashboards, receive feedback, track their progress, and collaborate on tasks.
- Teachers can manage assignments, view student analytics, and provide feedback.
- Parents/Guardians can monitor their child’s academic progress and receive important notifications.
- Administrators manage users and the overall system.


## Technologies Used

- Frontend: React.js, Redux
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT-based authentication
- Styling: CSS


## License

This project is licensed under the MIT License. See the LICENSE file for details.