i have to close the unclear issue and re-create once they working on it
# Welcome to KhodKquiz
# 🧑‍💻 Coding Quiz and Leaderboard System

A full-stack web-based platform where users can take quizzes by category or difficulty, track their scores, and compete on a public leaderboard. Admins can manage questions, categories, and view analytics.

## 🛠️ Getting Started

# 📁 Project Structure - KhodKquiz

---
```plaintext
Coding-Quiz-and_leaderboard-System/
├── backend/                   # Backend logic (Express.js / Django / FastAPI)
│   ├── src/
│   │   ├──controllers/        # Business logic for routes (e.g., quizController.js)
│   │   ├── routes/            # API endpoints (e.g., quizRoutes.js)
│   │   ├── models/            # DB schema models (e.g., User.js)
│   │   ├── middlewares/       # JWT auth, error handling, logging
│   │   ├── services/          # Helper logic (e.g., score calculation)
│   │   ├── config/            # DB connection, env configs
│   ├── tests/                 # Backend unit/integration tests
│   ├── app.js                 # Main express app
│   ├── server.js              # Entry point to start backend server
│   └── .env                   # Backend environment variables
│
├── frontend/                  # Frontend logic (React or HTML/CSS/JS)
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components (e.g., QuizCard.jsx)
│   │   ├── pages/             # Pages like Login, Dashboard, Quiz
│   │   ├── services/          # API calls (e.g., quizService.js)
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx            # Main app component
│   │   └── index.js           # Entry point
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── postcss.config.js      # PostCSS config
│   ├── package.json
│   └── .env                   # Frontend environment variables
│
├── database/                  # DB setup & maintenance
│   ├── schema.sql             # SQL schema definitions (tables, constraints)
│   ├── seed.sql               # Initial dummy data
│   ├── erd.png                # ERD diagram
│   ├── procedures.sql         # Stored procedures / views / triggers
│   └── backup/                # Backup & restore scripts
│
├── docs/                      # Project documentation
│   ├── api.md                 # API spec (endpoints, parameters)
│   ├── architecture.md        # System design
│   └── README.md              # Can be symlinked to root
│
├── .gitignore
├── README.md                  # Project overview (root level)
├── LICENSE
└── package.json / Pipfile     # If mono repo has shared dependencies
```
---

### 🚀 How to Run the Project

#### 1. Clone the Repo

```bash
git clone https://github.com/PhaySometh/KhodKquiz.git
cd KhodKquiz
```
## 2. Setup .env

the example file and fill in real credentials.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
## 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## 4. Run Backend
```bash 
cd backend
npm install
npm run dev
```

## 5. Database (Coming Soon)
```bash
cd database
```

### ✅ Key Features

-   **User Authentication** (Sign Up / Log In)
-   **Quiz Generation**
    -   Randomized or category-based questions
    -   Timed quizzes (optional)
-   **Score Submission**
-   **Leaderboard**
    -   Top scorers (Today / This Week / All-Time)
    -   Filter by category
-   **Admin Panel**
    -   CRUD for quizzes, questions, and categories
    -   View reports (average score, attempts)

### 📦 Tech Stack
--- 

| Layer     | Tech Stack                                  |
| --------- | ------------------------------------------- |
| Frontend  | React, Vite, Axios, Tailwind CSS            |
| Backend   | Node.js, Express.js, JWT, bcrypt            |
| Database  | PostgreSQL / MySQL, SQL Scripts, ERD        |
| UI Tools  | DaisyUI, TailwindUi,  ..                    |
| Dev Tools | Nodemon, ESLint, Prettier, GitHub           |

---

## 🗃️ Database Responsibilities (Database Admin Course Focus)

### 📊 ERD (Entity Relationship Diagram - Example)

#### Users

-   `id`, `name`, `email`, `password`, `role` (user/admin)

#### Categories

-   `id`, `name`

#### Questions

-   `id`, `question_text`, `category_id`, `difficulty`, `correct_answer`, `choices` (optional JSON field)

#### Quizzes

-   `id`, `user_id`, `score`, `start_time`, `end_time`

#### Quiz_Answers

-   `id`, `quiz_id`, `question_id`, `user_answer`, `is_correct`

### 💡 Advanced Database Concepts

-   Indexes on `user_id`, `score`, `category_id`
-   Views for “Top 10 Scores This Month”
-   Stored procedures to calculate score per quiz
-   Triggers (e.g., update leaderboard after each quiz)
-   Backup & restore strategy
-   Normalization up to 3NF
-   _(Optional)_ Use PostgreSQL for advanced SQL features

---

## 🖥 Frontend (Frontend Skills Previously Acquired)

### 🎨 UI Features

-   Beautiful landing page (with CTA: "Take a Quiz!")
-   User Dashboard (shows past scores and progress graph)
-   Quiz Interface (one question at a time or paginated)
-   Leaderboard:
    -   Filter by category
    -   Medal icons (🥇 🥈 🥉)
-   Admin Dashboard:
    -   Add/Edit/Delete questions and categories
    -   Export data (CSV/PDF)
-   Fully responsive (desktop & mobile)

---

## 📦 Optional Cool Features

-   Countdown timer for timed quizzes
-   Difficulty levels: Easy / Medium / Hard
-   Quiz history tracking
-   “Retry Quiz” or “Review Answers” feature
-   Email performance reports to users
-   Share scores on social media
-   Dark/Light mode toggle

---

## 💡 Why It’s Perfect for Your Courses

| Feature                    | Backend Dev ✅ | DB Admin ✅ |
| -------------------------- | -------------- | ----------- |
| User authentication, API   | ✅             | —           |
| Score calculation logic    | ✅             | ✅          |
| CRUD for questions/quizzes | ✅             | ✅          |
| Leaderboard queries        | ✅             | ✅          |
| ERD, normalization         | —              | ✅          |
| Indexes, triggers          | —              | ✅          |
