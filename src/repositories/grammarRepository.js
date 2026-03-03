const db = require("../configs/db");

class GrammarRepository {
  // Thêm ngữ pháp mới
  static async createGrammar(data) {
    const { lesson_id, title, structure, explanation, example_en, example_vi } =
      data;
    const query = `
            INSERT INTO grammars (lesson_id, title, structure, explanation, example_en, example_vi) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
    const { rows } = await db.query(query, [
      lesson_id,
      title,
      structure,
      explanation,
      example_en,
      example_vi,
    ]);
    return rows[0];
  }

  // Lấy danh sách ngữ pháp của 1 bài học
  static async getGrammarsByLessonId(lessonId) {
    const query = `SELECT * FROM grammars WHERE lesson_id = $1 ORDER BY id ASC`;
    const { rows } = await db.query(query, [lessonId]);
    return rows;
  }

  // Lấy chi tiết 1 ngữ pháp
  static async getGrammarById(id) {
    const query = `SELECT * FROM grammars WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Cập nhật ngữ pháp
  static async updateGrammar(id, data) {
    const { title, structure, explanation, example_en, example_vi } = data;
    const query = `
            UPDATE grammars 
            SET title = $1, structure = $2, explanation = $3, example_en = $4, example_vi = $5 
            WHERE id = $6 RETURNING *
        `;
    const { rows } = await db.query(query, [
      title,
      structure,
      explanation,
      example_en,
      example_vi,
      id,
    ]);
    return rows[0];
  }

  // Xóa ngữ pháp
  static async deleteGrammar(id) {
    const query = `DELETE FROM grammars WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = GrammarRepository;
