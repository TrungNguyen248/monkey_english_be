-- Tạo database (chạy lệnh này riêng biệt trước, sau đó connect vào database này để chạy các lệnh dưới)
-- CREATE DATABASE monkey_english;

-- ==========================================
-- TẠO CÁC KIỂU DỮ LIỆU ENUM
-- ==========================================
CREATE TYPE course_status AS ENUM ('draft', 'published');
CREATE TYPE lesson_status AS ENUM ('learning', 'completed');
-- THÊM MỚI: Định nghĩa kiểu Role cho người dùng
CREATE TYPE user_role AS ENUM ('user', 'admin'); 

-- ==========================================
-- TẠO BẢNG
-- ==========================================

-- 1. Bảng người dùng (Users) - Đã cập nhật thêm cột 'role'
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',   -- Mặc định ai đăng ký cũng là 'user' bình thường
    total_points INT DEFAULT 0,
    current_level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Đánh index cột total_points để tăng tốc độ truy vấn Bảng xếp hạng
CREATE INDEX idx_users_points ON users(total_points DESC);

-- 2. Bảng Khóa học (Courses)
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status course_status DEFAULT 'draft',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Bài học (Lessons)
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INT NOT NULL,
    points_reward INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN lessons.order_index IS 'Thứ tự bài học trong khóa';
COMMENT ON COLUMN lessons.points_reward IS 'Điểm thưởng khi hoàn thành bài';

-- 4. Bảng Từ vựng (Vocabularies)
CREATE TABLE vocabularies (
    id SERIAL PRIMARY KEY,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    word VARCHAR(100) NOT NULL,
    word_type VARCHAR(50),
    meaning VARCHAR(255) NOT NULL,
    pronunciation VARCHAR(100),
    example_en TEXT,
    example_vi TEXT
);
COMMENT ON COLUMN vocabularies.word_type IS 'noun, verb, adj, adv...';

-- 5. Bảng Ngữ pháp (Grammars)
CREATE TABLE grammars (
    id SERIAL PRIMARY KEY,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    structure TEXT NOT NULL,
    explanation TEXT,
    example_en TEXT,
    example_vi TEXT
);

-- 6. Bảng Đề bài tập (Quizzes)
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    passing_score INT DEFAULT 0,
    points_reward INT DEFAULT 0
);
COMMENT ON COLUMN quizzes.passing_score IS 'Điểm/Số câu tối thiểu để qua';
COMMENT ON COLUMN quizzes.points_reward IS 'Điểm thưởng khi pass quiz';

-- 7. Bảng Câu hỏi (Questions)
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    quiz_id INT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice'
);
COMMENT ON COLUMN questions.question_type IS 'multiple_choice, fill_blank...';

-- 8. Bảng Đáp án (Answers)
CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

-- 9. Tiến độ Khóa học (User Course Progress)
CREATE TABLE user_course_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    earned_points INT DEFAULT 0,
    enroll_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, course_id)
);
COMMENT ON COLUMN user_course_progress.progress_percentage IS '% hoàn thành khóa học';
COMMENT ON COLUMN user_course_progress.earned_points IS 'Số điểm User đã kiếm được riêng trong khóa này';

-- 10. Tiến độ Bài học (User Lesson Progress)
CREATE TABLE user_lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status lesson_status DEFAULT 'learning',
    completed_at TIMESTAMP NULL,
    UNIQUE (user_id, lesson_id)
);

-- 11. Kết quả làm bài Quiz (User Quiz Results)
CREATE TABLE user_quiz_results (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0,
    is_passed BOOLEAN DEFAULT FALSE,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TẠO TRIGGER ĐỂ TỰ ĐỘNG CẬP NHẬT last_accessed
-- ==========================================

CREATE OR REPLACE FUNCTION update_last_accessed_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.last_accessed = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_accessed
BEFORE UPDATE ON user_course_progress
FOR EACH ROW
EXECUTE FUNCTION update_last_accessed_column();