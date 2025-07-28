# 🎓 KhodKquiz - Enhanced Interactive Quiz Platform

**Academic Project - Full-Stack Web Development**
_Cambodia Academy of Digital Technology_

A comprehensive, enterprise-grade quiz application demonstrating modern web development practices, advanced database design, and professional software architecture. Built with React 19, Node.js, and PostgreSQL, featuring complete role-based access control, real-time analytics, and advanced admin management capabilities.

## 📋 Table of Contents

-   [Project Overview](#-project-overview)
-   [Features & Capabilities](#-features--capabilities)
-   [Technology Stack](#-technology-stack)
-   [Architecture & Design](#-architecture--design)
-   [Installation & Setup](#-installation--setup)
-   [Database Schema](#-database-schema)
-   [API Documentation](#-api-documentation)
-   [Security Implementation](#-security-implementation)
-   [Performance Optimization](#-performance-optimization)
-   [Academic Learning Outcomes](#-academic-learning-outcomes)

## 🎯 Project Overview

KhodKquiz represents a complete learning management system focused on interactive quiz-based education. The platform demonstrates advanced full-stack development concepts including:

-   **Enterprise-level Architecture**: Scalable, maintainable codebase with proper separation of concerns
-   **Advanced Database Design**: Normalized schema with optimized queries and proper indexing
-   **Security Best Practices**: JWT authentication, RBAC, input validation, and XSS protection
-   **Modern UI/UX**: Responsive design with smooth animations and accessibility features
-   **Real-time Features**: Live leaderboards, instant feedback, and dynamic content updates

### 🎓 Academic Context

This project serves as a capstone demonstration of:

-   Full-stack web development proficiency
-   Database design and optimization
-   Security implementation and best practices
-   Modern JavaScript frameworks and libraries
-   RESTful API design and implementation
-   User experience design and accessibility

## 🚀 Features & Capabilities

### 👨‍🎓 Student Experience

-   **Interactive Quiz Interface**: Timed quizzes with real-time feedback and scoring
-   **Progress Tracking**: Comprehensive analytics across categories and difficulty levels
-   **Leaderboard Competition**: Global and category-specific rankings with performance metrics
-   **Profile Management**: Custom profile pictures, statistics, and achievement tracking
-   **Teacher Application System**: Structured application process for role elevation

### 👨‍🏫 Teacher Capabilities

-   **Advanced Quiz Creation**: Multi-question types with rich content support
-   **Class Management**: Student organization and assignment distribution
-   **Performance Analytics**: Detailed insights into student progress and quiz effectiveness
-   **Content Library**: Reusable question banks and template management
-   **Bulk Operations**: Efficient management of large datasets

### 👨‍💼 Administrative Control

-   **User Management**: Complete CRUD operations with advanced filtering and search
-   **System Analytics**: Real-time dashboard with comprehensive metrics
-   **Teacher Application Review**: Structured approval workflow with commenting system
-   **Quiz Template System**: Pre-built content for rapid deployment
-   **Import/Export Functionality**: Data portability and backup capabilities
-   **Bulk Operations**: Efficient batch processing for system maintenance

## 🛠️ Technology Stack

### Frontend Architecture

```
React 19.1.0          # Modern UI library with concurrent features
├── React Router 7.6.2    # Advanced routing with data loading
├── Tailwind CSS 4.1.8    # Utility-first styling framework
├── Framer Motion 12.19.1 # Professional animations and transitions
├── Axios 1.9.0           # HTTP client with interceptors
├── React Hot Toast 2.5.2 # Notification system
└── Lucide React 0.511.0  # Modern icon library
```

### Backend Infrastructure

```
Node.js 18+           # JavaScript runtime environment
├── Express.js 4.x        # Web application framework
├── PostgreSQL 13+        # Advanced relational database
├── Sequelize 6.x         # Object-Relational Mapping
├── JWT                   # Stateless authentication
├── bcrypt               # Password hashing
├── Helmet               # Security middleware
└── Morgan               # HTTP request logging
```

### Development Environment

```
Vite 6.3.5            # Next-generation build tool
├── ESLint 9.25.0         # Code quality and consistency
├── Prettier             # Code formatting
├── PostCSS 8.5.4        # CSS processing
└── Git                  # Version control system
```

## 🏗️ Architecture & Design

### Project Structure

```
KhodKquiz/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── admin/          # Admin-specific components
│   │   │   ├── common/         # Shared components
│   │   │   └── modals/         # Modal dialogs
│   │   ├── pages/              # Route components
│   │   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── client/         # User-facing pages
│   │   │   └── auth/           # Authentication pages
│   │   ├── contexts/           # React context providers
│   │   ├── utils/              # Utility functions
│   │   ├── assets/             # Static resources
│   │   └── routes/             # Route configuration
│   └── public/                 # Static files
├── backend/                    # Node.js application
│   ├── src/
│   │   ├── controllers/        # Business logic handlers
│   │   │   ├── admin/          # Admin operations
│   │   │   ├── client/         # Client operations
│   │   │   └── auth/           # Authentication logic
│   │   ├── models/             # Database models
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Custom middleware
│   │   ├── config/             # Configuration files
│   │   └── seeders/            # Database initialization
│   └── migrations/             # Database migrations
└── docs/                       # Documentation files
```

### Design Patterns Implemented

-   **MVC Architecture**: Clear separation of Model, View, and Controller layers
-   **Repository Pattern**: Abstracted data access layer
-   **Middleware Pattern**: Composable request processing pipeline
-   **Observer Pattern**: Event-driven updates and notifications
-   **Factory Pattern**: Dynamic component and model creation
-   **Singleton Pattern**: Database connection and configuration management

## 🚀 Installation & Setup

### Prerequisites

-   **Node.js**: Version 18.0 or higher
-   **PostgreSQL**: Version 13.0 or higher
-   **npm**: Version 8.0 or higher
-   **Git**: For version control

### Step-by-Step Installation

1. **Repository Setup**

    ```bash
    git clone <repository-url>
    cd KhodKquiz
    ```

2. **Backend Configuration**

    ```bash
    cd backend
    npm install

    # Create environment file
    cp .env.example .env
    # Edit .env with your database credentials
    ```

3. **Database Initialization**

    ```bash
    # Create PostgreSQL database
    createdb khodkquiz_dev

    # Run database setup
    npm run seed
    ```

4. **Frontend Setup**

    ```bash
    cd ../frontend
    npm install
    ```

5. **Environment Variables**

    ```env
    # Backend (.env)
    PORT=3000
    NODE_ENV=development
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=khodkquiz_dev
    DB_USER=your_username
    DB_PASSWORD=your_password
    JWT_USER_SECRET=your_secure_jwt_secret_here
    ```

6. **Application Launch**

    ```bash
    # Terminal 1: Backend server
    cd backend && npm run dev

    # Terminal 2: Frontend development server
    cd frontend && npm run dev
    ```

7. **Access Points**
    - **Frontend**: http://localhost:5173
    - **Backend API**: http://localhost:3000
    - **Admin Panel**: http://localhost:5173/admin

### Default Credentials

```
Admin Account:
Email: admin@khodkquiz.com
Password: admin123
```

⚠️ **Security Note**: Change default credentials immediately in production.

## 📊 Database Schema

### Entity Relationship Design

The database implements a normalized schema with proper relationships and constraints:

#### Core Entities

```sql
-- User Management
Users (id, name, email, password, role, provider, picture, createdAt)
TeacherApplications (id, userId, status, applicationData, reviewedBy, reviewedAt)

-- Quiz System
SystemCategories (id, name, description, createdAt)
SystemQuizzes (id, title, description, category, difficulty, time, questionsCount)
SystemQuestions (id, systemQuizId, text, type)
SystemAnswerOptions (id, systemQuestionId, text, isCorrect)

-- Results & Analytics
SystemQuizResults (id, studentId, systemQuizId, score, accuracy, attemptNumber)
SystemStudentAnswers (id, systemQuizResultId, systemQuestionId, selectedOptionId)
```

#### Key Relationships

-   **Users → TeacherApplications**: One-to-Many (applicant relationship)
-   **Users → SystemQuizzes**: One-to-Many (creator relationship)
-   **SystemCategories → SystemQuizzes**: One-to-Many
-   **SystemQuizzes → SystemQuestions**: One-to-Many
-   **SystemQuestions → SystemAnswerOptions**: One-to-Many
-   **Users → SystemQuizResults**: One-to-Many
-   **SystemQuizResults → SystemStudentAnswers**: One-to-Many

#### Database Optimization

-   **Indexes**: Strategic indexing on frequently queried columns
-   **Foreign Keys**: Referential integrity enforcement
-   **Constraints**: Data validation at database level
-   **Normalization**: Third normal form compliance
-   **Performance**: Optimized queries with proper joins

## 🔌 API Documentation

### Authentication Endpoints

```http
POST   /api/user/register          # User registration
POST   /api/user/login             # User authentication
GET    /api/user                   # Current user profile
PUT    /api/user/profile           # Profile updates
POST   /api/user/logout            # Session termination
```

### Student Endpoints

```http
GET    /api/public/categories      # Browse quiz categories
GET    /api/student/quiz/:id       # Get quiz questions
POST   /api/student/quiz/:id/submit # Submit quiz answers
GET    /api/student/progress       # Learning progress
GET    /api/student/results/:id    # Detailed quiz results
GET    /api/student/leaderboard    # Competition rankings
```

### Teacher Endpoints

```http
POST   /api/teacher/quiz           # Create new quiz
GET    /api/teacher/quizzes        # Manage created quizzes
PUT    /api/teacher/quiz/:id       # Update quiz content
DELETE /api/teacher/quiz/:id       # Remove quiz
GET    /api/teacher/analytics      # Performance insights
```

### Admin Endpoints

```http
GET    /api/admin/users            # User management
POST   /api/admin/users            # Create user accounts
PUT    /api/admin/users/:id        # Update user details
DELETE /api/admin/users/:id        # Remove user accounts
GET    /api/admin/analytics        # System-wide statistics
GET    /api/admin/quiz/templates   # Quiz templates
POST   /api/admin/quiz/import      # Bulk quiz import
```

### Teacher Application System

```http
POST   /api/teacher-application/apply     # Submit application
GET    /api/teacher-application/status    # Check application status
GET    /api/admin/teacher-applications    # Review applications (Admin)
PUT    /api/admin/teacher-applications/:id # Approve/Reject (Admin)
```

---

**© 2025 KhodKquiz Development Team - Academic Project**
_This project demonstrates enterprise-level full-stack development capabilities and serves as a comprehensive learning portfolio for modern web development practices._
