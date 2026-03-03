const db = require("../configs/db");

class QuizRepository {
  // Thêm đề bài mới
  static async createQuiz(lessonId, title, passingScore, pointsReward) {
    const query = `
            INSERT INTO quizzes (lesson_id, title, passing_score, points_reward) 
            VALUES ($1, $2, $3, $4) RETURNING *
        `;
    const { rows } = await db.query(query, [
      lessonId,
      title,
      passingScore,
      pointsReward,
    ]);
    return rows[0];
  }

  // Lấy danh sách quiz của 1 bài học
  static async getQuizzesByLessonId(lessonId) {
    const query = `SELECT * FROM quizzes WHERE lesson_id = $1 ORDER BY id ASC`;
    const { rows } = await db.query(query, [lessonId]);
    return rows;
  }

  // Lấy thông tin cơ bản của 1 quiz
  static async getQuizById(id) {
    const query = `SELECT * FROM quizzes WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Lấy TOÀN BỘ Quiz bao gồm Câu hỏi và Đáp án (Join dữ liệu)
  static async getFullQuizDetails(quizId) {
    // 1. Lấy thông tin quiz
    const quiz = await this.getQuizById(quizId);
    if (!quiz) return null;

    // 2. Lấy danh sách câu hỏi của quiz này
    const questionsQuery = `SELECT * FROM questions WHERE quiz_id = $1 ORDER BY id ASC`;
    const questionsResult = await db.query(questionsQuery, [quizId]);
    const questions = questionsResult.rows;

    if (questions.length === 0) {
      quiz.questions = [];
      return quiz;
    }

    // 3. Lấy tất cả đáp án của các câu hỏi trên
    const questionIds = questions.map((q) => q.id);
    const answersQuery = `SELECT * FROM answers WHERE question_id = ANY($1) ORDER BY id ASC`;
    const answersResult = await db.query(answersQuery, [questionIds]);
    const allAnswers = answersResult.rows;

    // 4. Nhúng (Map) đáp án vào từng câu hỏi tương ứng
    questions.forEach((q) => {
      q.answers = allAnswers.filter((a) => a.question_id === q.id);
    });

    quiz.questions = questions;
    return quiz;
  }

  // Cập nhật quiz
  static async updateQuiz(id, title, passingScore, pointsReward) {
    const query = `
            UPDATE quizzes 
            SET title = $1, passing_score = $2, points_reward = $3 
            WHERE id = $4 RETURNING *
        `;
    const { rows } = await db.query(query, [
      title,
      passingScore,
      pointsReward,
      id,
    ]);
    return rows[0];
  }

  // Xóa quiz
  static async deleteQuiz(id) {
    const query = `DELETE FROM quizzes WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async getCorrectAnswers(quizId) {
    const query = `
        SELECT q.id AS question_id, a.id AS answer_id
        FROM questions q
        JOIN answers a ON q.id = a.question_id
        WHERE q.quiz_id = $1 AND a.is_correct = true
    `;
    const { rows } = await db.query(query, [quizId]);
    return rows; // Trả về mảng các cặp [question_id, answer_id] đúng
  }

  static async saveQuizResult(userId, quizId, score, isPassed) {
    const query = `
        INSERT INTO user_quiz_results (user_id, quiz_id, score, is_passed)
        VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const { rows } = await db.query(query, [userId, quizId, score, isPassed]);
    return rows[0];
  }

  static async hasUserPassedQuiz(userId, quizId) {
    const query = `
        SELECT id FROM user_quiz_results 
        WHERE user_id = $1 AND quiz_id = $2 AND is_passed = true 
        LIMIT 1
    `;
    const { rows } = await db.query(query, [userId, quizId]);

    // Nếu mảng rows có phần tử nghĩa là đã từng pass
    return rows.length > 0;
  }
}

module.exports = QuizRepository;
