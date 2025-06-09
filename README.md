# Welcome to KhodKquiz 🧑‍💻

A full-stack web-based platform where users can take quizzes by category or difficulty, track their scores, and compete on a public leaderboard. Admins can manage questions, categories, and view analytics.

### 🚀 How to Run the Project

#### 1. Clone the Repo

```bash
git clone https://github.com/PhaySometh/KhodKquiz.git
cd KhodKquiz
```
## 2. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## 3. Run Backend
```bash 
cd backend
npm install
npm run dev
```

### ✅ Key Features

-   **User Authentication**
    -   Sign Up: Create new acc, Edit, and delete
    -   Login: With exisiting signup acc and Google
-   **Create quiz**
    - CRUD quiz
    - Share link and code for realtime use
-   **Quiz feature**
    -   User can do Coding Language base quiz(C program, C++, JS, ...) which is API call for Pre-built Multiple Choice Question.
        -   For Quizzes choice is like C program I, C program II, C program III, or C program Begineer, C program OOP...
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
    *** NEED HELP !!! ***
    -   CRUD for quizzes, questions, and categories
    -   View reports (average score, attempts)

### 📦 Tech Stack
--- 

| Layer     | Tech Stack                                  |
| --------- | ------------------------------------------- |
| Frontend  | React + Vite, Axios, Tailwind CSS            |
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
