# Project-ZooNest
🐾 ZooNest – Zoo Management System

ZooNest is a full-stack zoo management system where users can explore animals, view detailed information, book tickets, generate receipts, check upcoming events, and contact the zoo.
Admins can manage animals, events, ticket rates, bookings, and users through a powerful admin dashboard.

📁 Project Structure
ZooNest/
│── .vscode/
│── Database/
│   └── zoo_db.sql
│── middleware/
│   └── auth.js
│── node_modules/
│── public/
│── src/
│── uploads/
│── .env.example
│── .gitignore
│── package.json
│── package-lock.json
│── README.md
│── server.js


✔️ React frontend + Node backend inside one folder
✔️ Database dump included in /Database

🚀 Tech Stack

Frontend: React.js

Backend: Node.js, Express.js

Database: MySQL

✨ Features
👤 User Features

Browse animals

Search animals by name

View detailed animal information

Book tickets

Generate ticket receipts

View upcoming events

Contact & About pages

User Registration & Login

🔐 Admin Features

Manage animals (Add / Update / Delete)

Manage events

Manage ticket rates

View all ticket bookings

Full admin dashboard

⚙️ Installation & Setup
1️⃣ Install dependencies
npm install

2️⃣ Start backend server
node server.js

3️⃣ Start frontend (React)
npm start

4️⃣ Import the database

Open MySQL / phpMyAdmin

Create a new database (example: zoo)

Import file:

Database/zoo_db.sql

🔧 Environment Variables

Your .env.example contains required fields.
Create a .env file like this:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=zoo

JWT_SECRET=yourjwttoken
PORT=5000
<<<<<<< HEAD

=======
>>>>>>> 802a48b205b3c8014a0c86e7024f45e6495b873f
