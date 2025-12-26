# 🏋️‍♂️ FitLife – Smart Fitness & Wellness Platform

FitLife is a full-stack fitness and wellness web application designed to help users track workouts, follow structured fitness plans, monitor progress, and stay motivated through a clean, modern, and responsive interface.

Built with a modern MERN-style architecture, FitLife focuses on performance, scalability, and real-world usability.

---

[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-API-b23a48.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-red.svg)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange.svg)](https://jwt.io/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-yellow.svg)](https://nodemailer.com/about/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-0ea5e9.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-purple.svg)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()


## 🚀 Quick Start (5 Minutes)
### Prerequisites

- Node.js 18+
- MongoDB (Local or Atlas)
- Git installed
- A modern browser

## Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/indxr1904/FitLife-Smart-Fitness-Wellness-Platform.git

# 2. Setup Backend
cd backend
npm install
cp .env.example .env   # Add your MongoDB URL & JWT secret
npm start              # Starts backend at http://localhost:3000

# 3. Setup Frontend
cd ../frontend
npm install
npm run dev            # Starts frontend at http://localhost:5173
```
## 🔑 Default Login 

### For Admin:
 - 📧 Email: demo@fitlife.com
 - 🔐 Password: demo123

| Component |	Port |	Description |
|-----------|------|--------------|
| Frontend (React) |	5173 |	User Interface |
| Backend (Express API) |	3000 |	Authentication, Firebase |
| MongoDB	| 27017 or Atlas |	Database |

## 🏗 Project Structure

```
GYM-WEBSITE/
│
├── backend/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── .env
│   ├── firebaseAdmin.js
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── firebase.js
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```
