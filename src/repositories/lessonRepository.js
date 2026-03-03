const db = require("../configs/db");

class LessonRepository {
  // Thêm bài học mới
  static async createLesson(courseId, title, orderIndex, pointsReward) {
    const query = `
            INSERT INTO lessons (course_id, title, order_index, points_reward) 
            VALUES ($1, $2, $3, $4) RETURNING *
        `;
    const { rows } = await db.query(query, [
      courseId,
      title,
      orderIndex,
      pointsReward,
    ]);
    return rows[0];
  }

  // Lấy danh sách bài học của 1 khóa học (Sắp xếp theo thứ tự order_index)
  static async getLessonsByCourseId(courseId) {
    const query = `
            SELECT * FROM lessons 
            WHERE course_id = $1 
            ORDER BY order_index ASC
        `;
    const { rows } = await db.query(query, [courseId]);
    return rows;
  }

  // Lấy chi tiết 1 bài học
  static async getLessonById(id) {
    const query = `SELECT * FROM lessons WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Cập nhật bài học
  static async updateLesson(id, title, orderIndex, pointsReward) {
    const query = `
            UPDATE lessons 
            SET title = $1, order_index = $2, points_reward = $3 
            WHERE id = $4 RETURNING *
        `;
    const { rows } = await db.query(query, [
      title,
      orderIndex,
      pointsReward,
      id,
    ]);
    return rows[0];
  }

  // Xóa bài học
  static async deleteLesson(id) {
    const query = `DELETE FROM lessons WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = LessonRepository;
