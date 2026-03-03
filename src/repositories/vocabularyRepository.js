const db = require("../configs/db");

class VocabularyRepository {
  // Thêm từ vựng mới
  static async createVocabulary(data) {
    const {
      lesson_id,
      word,
      word_type,
      meaning,
      pronunciation,
      example_en,
      example_vi,
    } = data;
    const query = `
            INSERT INTO vocabularies (lesson_id, word, word_type, meaning, pronunciation, example_en, example_vi) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;
    const { rows } = await db.query(query, [
      lesson_id,
      word,
      word_type,
      meaning,
      pronunciation,
      example_en,
      example_vi,
    ]);
    return rows[0];
  }

  // Lấy danh sách từ vựng của 1 bài học
  static async getVocabulariesByLessonId(lessonId) {
    const query = `SELECT * FROM vocabularies WHERE lesson_id = $1 ORDER BY id ASC`;
    const { rows } = await db.query(query, [lessonId]);
    return rows;
  }

  // Lấy chi tiết 1 từ vựng
  static async getVocabularyById(id) {
    const query = `SELECT * FROM vocabularies WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Cập nhật từ vựng
  static async updateVocabulary(id, data) {
    const { word, word_type, meaning, pronunciation, example_en, example_vi } =
      data;
    const query = `
            UPDATE vocabularies 
            SET word = $1, word_type = $2, meaning = $3, pronunciation = $4, example_en = $5, example_vi = $6 
            WHERE id = $7 RETURNING *
        `;
    const { rows } = await db.query(query, [
      word,
      word_type,
      meaning,
      pronunciation,
      example_en,
      example_vi,
      id,
    ]);
    return rows[0];
  }

  // Xóa từ vựng
  static async deleteVocabulary(id) {
    const query = `DELETE FROM vocabularies WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = VocabularyRepository;
