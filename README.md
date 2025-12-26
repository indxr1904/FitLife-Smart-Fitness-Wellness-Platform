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

## 🔐 Environment Variables

## Backend (backend/.env)

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=your_project_id
```
## Frontend (frontend/.env)

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_PROJECT_ID=your_project_id
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## ✨ Features
###👤 User

-Email & Google authentication (Firebase)
-Profile management with avatar
-Weekly workout plans
-Nutrition schedules
-Dashboard with active plan
-Responsive UI (mobile & desktop)

###🧠 Fitness Logic

-Beginner / Intermediate / Advanced plans
-Only one active plan at a time
-Replace plan confirmation
-Daily workout & diet fetching

### 🛠 Admin

-Manage exercises
-Manage diets
-Create workout plans
-Admin-only routes

| Component |	Port |	Description |
|-----------|------|--------------|
| Frontend (React) |	5173 |	User Interface |
| Backend (Express API) |	3000 |	Authentication, Firebase |
| MongoDB	| 27017 or Atlas |	Database |

## 🧪 Run Locally

## Backend

```
cd backend
npm install
npm run dev
```

## Frontend

```
cd frontend
npm install
npm run dev
```

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

## 🔒 Security Notes

-Secrets removed from Git history
-Firebase keys managed via environment variables
-GitHub push protection enabled
-JWT-based API authentication

## 🧩 Tech Stack
### Frontend

-React (Vite)
-Tailwind CSS
-React Router
-Firebase Auth
-React Toastify

### Backend

-Node.js
-Express.js
-MongoDB Atlas
-JWT Authentication
-Firebase Admin SDK

###Deployment

-Frontend: Vercel
-Backend: Render
-Database: MongoDB Atlas

## 👨‍💻 Author

### Inderjeet Singh
### Full-Stack Developer (MERN)
-GitHub: https://github.com/indxr1904
-LinkedIn: https://linkedin.com/in/your-profile

## ⭐ Support

If you like this project, give it a ⭐ on GitHub.
