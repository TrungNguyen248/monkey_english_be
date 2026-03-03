const db = require("../configs/db");

class QARepository {
  // --- QUẢN LÝ CÂU HỎI ---
  static async createQuestion(
    quizId,
    content,
    questionType = "multiple_choice",
  ) {
    const query = `
            INSERT INTO questions (quiz_id, content, question_type) 
            VALUES ($1, $2, $3) RETURNING *
        `;
    const { rows } = await db.query(query, [quizId, content, questionType]);
    return rows[0];
  }

  static async deleteQuestion(id) {
    const query = `DELETE FROM questions WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // --- QUẢN LÝ ĐÁP ÁN ---
  static async createAnswer(questionId, content, isCorrect = false) {
    const query = `
            INSERT INTO answers (question_id, content, is_correct) 
            VALUES ($1, $2, $3) RETURNING *
        `;
    const { rows } = await db.query(query, [questionId, content, isCorrect]);
    return rows[0];
  }

  static async deleteAnswer(id) {
    const query = `DELETE FROM answers WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = QARepository;
