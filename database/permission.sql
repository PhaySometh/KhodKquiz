-- Create user
CREATE USER teacher WITH PASSWORD '!*.akaza.teacher@123#$asd';

-- Create role
CREATE ROLE teachers;

-- Grant connect and privileges to role
GRANT CONNECT ON DATABASE neondb TO teachers;
GRANT USAGE ON SCHEMA public TO teachers;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO teachers;

-- Grant role to user
GRANT teachers TO teacher;

-- Create user
CREATE USER student WITH PASSWORD '!*.akaza.student@123#$asd';

-- Create role
CREATE ROLE students;

-- Grant connect and privileges to role
GRANT CONNECT ON DATABASE neondb TO students;
GRANT USAGE ON SCHEMA public TO students;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO students;

-- Grant role to user
GRANT students TO student;

-- View all user
SELECT * from pg_user;