CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create the quiz_questions table with a foreign key to categories
CREATE TABLE quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('multiple', 'boolean') NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    category_id INT NOT NULL,
    question TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    incorrect_answers JSON NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert default categories
INSERT INTO categories (id, name) VALUES 
(9, 'General Knowledge'),
(10, 'Entertainment: Books'),
(11, 'Science & Nature'),
(12, 'Sports'),
(13, 'History');