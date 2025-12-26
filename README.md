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
# ===============================
# Server Configuration
# ===============================
# Port on which the backend server will run
PORT=5000


# ===============================
# Database Configuration
# ===============================
# MongoDB connection string (MongoDB Atlas or local)
# Example:
# mongodb+srv://<username>:<password>@cluster.mongodb.net/fitlife
MONGO_URI=your_mongodb_uri


# ===============================
# Authentication / Security
# ===============================
# Secret key used to sign JWT tokens
# Keep this value strong and private
JWT_SECRET=your_jwt_secret


# ===============================
# Firebase Configuration
# ===============================
# Firebase project ID (used by Firebase Admin SDK)
FIREBASE_PROJECT_ID=your_project_id

```
## Frontend (frontend/.env)

```
# ===============================
# Firebase Configuration (Frontend)
# ===============================

# Firebase API key (public key used by frontend)
VITE_FIREBASE_API_KEY=your_firebase_api_key

# Firebase project ID
VITE_PROJECT_ID=your_project_id

# Firebase authentication domain
# Example: your-project-id.firebaseapp.com
VITE_FIREBASE_AUTH_DOMAIN=your_domain

# Firebase storage bucket
# Example: your-project-id.appspot.com
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket

# Firebase messaging sender ID
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

# Firebase application ID
VITE_FIREBASE_APP_ID=your_app_id

# Firebase analytics measurement ID (optional)
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

```

## ✨ Features
### 👤 User

- Email & Google authentication (Firebase)
- Profile management with avatar
- Weekly workout plans
- Nutrition schedules
- Dashboard with active plan
- Responsive UI (mobile & desktop)

### 🧠 Fitness Logic

- Beginner / Intermediate / Advanced plans
- Only one active plan at a time
- Replace plan confirmation
- Daily workout & diet fetching

### 🛠 Admin

- Manage exercises
- Manage diets
- Create workout plans
- Admin-only routes

| Component |	Port |	Description |
|-----------|------|--------------|
| Frontend (React) |	5173 |	User Interface |
| Backend (Express API) |	3000 |	Authentication, Firebase |
| MongoDB	| 27017 or Atlas |	Database |

## 🧪 Run Locally

## Backend

```
# Navigate to the backend directory
cd backend

# Install all backend dependencies listed in package.json
npm install

# Start the backend server in development mode (uses nodemon)
npm run dev

# Start backend in production mode
npm start

```

## Frontend

```
# Navigate to the frontend directory
cd frontend

# Install all frontend dependencies listed in package.json
npm install

# Start the frontend development server (Vite)
npm run dev

```

## 🏗 Project Structure

```
FIT-LIFE/
│
├── backend/                    # Backend (Node.js + Express)
│   ├── data/                   # Sample / static data files
│   ├── middleware/             # Custom middleware (auth, admin, etc.)
│   ├── models/                 # Mongoose models (User, Plan, Exercise, Diet)
│   ├── routes/                 # API routes (auth, plans, workouts, admin)
│   ├── seeders/                # Database seed scripts
│   ├── .env                    # Backend environment variables (NOT committed)
│   ├── firebaseAdmin.js        # Firebase Admin SDK configuration
│   ├── server.js               # Main Express server entry point
│   ├── package.json            # Backend dependencies and scripts
│
├── frontend/                   # Frontend (React + Vite)
│   ├── public/                 # Public static assets
│   ├── src/                    # Application source code
│   │   ├── assets/             # Images, icons, and media files
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context providers (Auth, Global state)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Application pages (Home, Login, Dashboard)
│   │   ├── utils/              # Utility/helper functions
│   │   ├── App.jsx             # Main React app component
│   │   ├── main.jsx            # Application entry point
│   │   └── firebase.js         # Firebase client configuration
│   ├── .env                    # Frontend environment variables (NOT committed)
│   ├── index.html              # HTML entry file
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies and scripts
│
├── .gitignore                  # Files and folders ignored by Git
└── README.md                   # Project documentation

```

## 🔒 Security Notes

- Secrets removed from Git history
- Firebase keys managed via environment variables
- GitHub push protection enabled
- JWT-based API authentication

## 🧩 Tech Stack
### Frontend

- React (Vite)
- Tailwind CSS
- React Router
- Firebase Auth
- React Toastify

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Firebase Admin SDK

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

- ## 📖 Additional Documentation

- [React.js Official Docs](https://react.dev/)
- [Vite Build Tool Docs](https://vitejs.dev/guide/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Routing Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB 6.x Manual](https://www.mongodb.com/docs/manual/)
- [Mongoose ODM Docs](https://mongoosejs.com/docs/)
- [JWT.io (JSON Web Tokens)](https://jwt.io/introduction)
- [REST API Best Practices](https://restfulapi.net/)
- [JavaScript ES6+ Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

## 👨‍💻 Author

### Inderjeet Singh
### Full-Stack Developer (MERN)
- GitHub: https://github.com/indxr1904
- LinkedIn: https://linkedin.com/in/your-profile

## ⭐ Support

If you like this project, give it a ⭐ on GitHub.

**Made with ❤️ to support coding community**

**Happy Coding! 🎉**
