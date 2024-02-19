
# ToDo List

Introducing my Todo List web app crafted with the power of MERN stack. Dive into a seamless task management experience, where you can effortlessly create, update, and delete tasks. The stylish touch of Tailwind CSS adds a visually appealing edge, while user authentication ensures your tasks stay private and secure. Embrace productivity with this intuitive and personalized task companion!

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- [Code Editor](https://code.visualstudio.com/download)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MongoDB](https://www.mongodb.com/) (MongoDB Database)
  - You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-hosted MongoDB database.

### Installation

1. Clone the repository

2. Clone the repository:

   ```bash
   https://github.com/slokhande310/To-Do-List
   ```
3. Navigate to the project directory:

   ```bash
   cd To-Do-List
   ```
4. Install dependencies:

   ```bash
   npm install
   ```
5. Install dependencies for backend

    ```bash
    cd Backend
   npm install
   ```
6. Set up the environment variables by creating a .env file in the Backend directory
   ```bash
   PORT=PORT_NUMBER
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   ```
7. Run the Backend application:

   ```bash
   nodemon ./index.js
   ```
8. Run the Frontend application:

   ```bash
   npm run dev
   ```
### That's it you are ready to go!!!  Now you can Create, Update, Delete and Mark your tasks as complete or active.
