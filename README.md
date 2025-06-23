# Welcome to KhodKquiz 🧑‍💻

KhodKquiz is a full-stack real-time quiz web application where users can participate in coding language quizzes, compete on leaderboards, and unlock badges based on their performance. Designed for both educational and competitive use, it includes user authentication, admin controls, and powerful database management features.

---
## 🌐 Live Demo (Coming Soon)

> 🚧 Hosted frontend on **Vercel** and backend on **Render/Railway**

---
## 📌 Features at a Glance

- ✅ **User Authentication (Email & Google)**
- ✅ **Category-based Quizzes (C, C++, JS...)**
- ✅ **Real-Time Countdown & Leaderboard**
- ✅ **Point System + Badge Unlocks**
- ✅ **Admin Dashboard (CRUD + Analytics)**
- ✅ **API-based Prebuilt Questions**
- ✅ **Database Security, Indexing, & Backup Plan**
- ✅ **Mobile Responsive Design**
- ✅ **Scalable & Modular Codebase**

---

## 🛠 Tech Stack Overview

| Layer            | Technology                                                                 |
|------------------|----------------------------------------------------------------------------|
| Frontend         | React + TailwindCSS + DaisyUI + React Router                               |
| Backend (API)    | Node.js + Express.js + Sequelize/Prisma ORM                                |
| Database         | PostgreSQL (Structured) + Redis (Real-Time Leaderboard & Caching)          |
| Authentication   | Firebase Auth or Auth0 (Email + Google Login)                              |
| Hosting          | Vercel (frontend), Render or Railway (backend/database)                    |
| Real-Time        | Socket.IO (quiz sync + leaderboard)                                        |
| Admin Panel      | Role-based UI with Recharts (Analytics)                                    |
| Email/Notify     | EmailJS / SendGrid (for notifications, password reset, etc.)               |

---
## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/PhaySometh/KhodKquiz.git
cd KhodKquiz
```

### 2. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Run Backend

```bash
cd backend
npm install
npm run dev
```
💡 Don't forget to set up your .env files for backend (DB_URL, JWT_SECRET, etc.) and frontend (Firebase config)

### ✅ Key Features

-   **User Authentication**
    -   Sign Up: Create new acc, Edit, and delete
    -   Login: With existing sign up acc and Google
-   **Create quiz**
    -   CRUD quiz
    -   Share link and code for realtime use
-   **Quiz feature**
    -   User can do Coding Language base quiz(C program, C++, JS, ...) which is API call for Pre-built Multiple Choice Question.
    -   For Quizzes choice is like C program I, C program II, C program III, or C program Beginner, C program OOP...
    -   Real Timed Countdown (Kahoot inspire...)
-   **Score given**
    -   High score base on answer speed and corrected answer
    -   Gain point to his account for each quiz
    -   Bonus feature: Badge (example, wording and score can be changed)
        -   100 in each language = noob in C
        -   300 in each language = rising star in C
        -   500 in each language = pro in C
        -   1000 in each language = Hacker in C
-   **Leaderboard** (real time update leaderboard)
    -   Top scorers (for each quiz (individual quiz leaderboard) / Top quiz participant (the more he do the more he easily getting top) / All-Time)
    -   Each language (pro in C...)
-   **Admin Panel**
    **_ NEED HELP !!! _**
    -   CRUD for quizzes, questions, and categories
    -   View reports (average score, attempts)

## 🔐 User Features
- Sign up with email/password or Google

- View and edit profile

- Attempt real-time quizzes

- See quiz history and badges

- Real-time leaderboard competition

### Features:

- SignUp with normal text/ Login with google/ and more
- Google Auth integration

- Edit profile

- Delete account

## 🧠 2. Quiz System
- Categorized by language and difficulty

- One-question-at-a-time or full-page layout

- Score based on:

    - Correct answers

    - Time remaining

- Track total score & badge milestones:

    - 🎖 100 pts = Noob

    - 🏅 300 pts = Rising Star

    - 🥇 500 pts = Pro

    - 🧠 1000 pts = Hacker
## 🧾 Admin Panel

Only accessible by admin users:

### ✅ CRUD Features:
- Create, Edit, Delete:
  - Categories
  - Questions
  - Quizzes

### 📊 View & Analytics:
- Total quiz attempts
- Average scores per quiz
- Most popular quizzes
- Analytics dashboard with **Recharts**
- Manage user roles and permissions

---

## 📡 Real-Time Features (Socket.IO + Redis)

- Each quiz session is a live **Socket.IO room**
- Host controls countdown and quiz progress
- Leaderboard updates in real time
- **Redis** stores live score state per session

---

## 🧰 Developer Tools

| Feature               | Tool                    |
|-----------------------|-------------------------|
| Form Validation       | React Hook Form + Zod   |
| Charts in Admin       | Recharts.js             |
| Authentication        | Firebase / Auth0        |
| ORM                   | Prisma / Sequelize      |
| Deployment            | Vercel + Render/Railway |
| Email Service         | EmailJS / SendGrid      |
| Testing (Backend)     | Postman + Jest          |
| Code Formatting       | Prettier + ESLint       |
| Live Dev Reload       | Nodemon                 |

---

## 📂 Database Architecture

### 🧱 Core Tables

| Table         | Key Columns                                      |
|---------------|--------------------------------------------------|
| `users`       | id, email, name, role, total_score               |
| `categories`  | id, name                                         |
| `questions`   | id, question, category_id, correct_answer, choices |
| `quizzes`     | id, user_id, quiz_code, score, timestamps        |
| `quiz_answers`| id, quiz_id, user_id, question_id, is_correct    |
| `badges`      | id, user_id, badge_name, category                |

---

### 📌 DB Concepts Used

- ✅ ERD & Relational Schema  
- ✅ Indexing (on `user_id`, `quiz_id`)  
- ✅ Views (e.g., Top 10 Scorers This Month)  
- ✅ Stored Procedures (for scoring logic)  
- ✅ Triggers (e.g., on quiz submission)  
- ✅ Backup & Recovery Strategy  
- ✅ Normalization up to **3NF**

---

## 🧑‍🏫 For Course Submission

| Requirement                     | Backend Dev ✅ | DB Admin ✅ |
|----------------------------------|----------------|-------------|
| User Auth (JWT/Firebase)        | ✅             | —           |
| Real-time Features (Socket.IO)  | ✅             | —           |
| Score Logic & Leaderboard       | ✅             | ✅          |
| CRUD APIs for Quizzes           | ✅             | ✅          |
| ERD + Normalized DB             | —              | ✅          |
| Indexes, Triggers, Backup       | —              | ✅          |
| Admin Role + Permissions        | ✅             | ✅          |
| Fake Data Insertion (1M+ rows)  | ✅             | ✅          |

---

## ⚙️ Future Ideas (Optional)

- 🎮 Gamification (level system, badges, XP)
- 🧾 Certificate generation after quiz
- 📧 Email performance summary to users
- 🔄 Quiz review + retry feature
- 🧑‍🏫 Admin CMS for new categories
- 📡 Offline mode with local caching

---

## 📄 License

**MIT License** — Free to use, modify, and contribute.
