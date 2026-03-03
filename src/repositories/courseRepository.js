const db = require("../configs/db");

class CourseRepository {
  // Thêm khóa học mới
  static async createCourse(title, description, status) {
    const query = `
            INSERT INTO courses (title, description, status) 
            VALUES ($1, $2, $3) RETURNING *
        `;
    const { rows } = await db.query(query, [title, description, status]);
    return rows[0];
  }

  // Lấy tất cả khóa học (Dành cho Admin)
  static async getAllCourses() {
    const query = `SELECT * FROM courses ORDER BY created_at DESC`;
    const { rows } = await db.query(query);
    return rows;
  }

  // Lấy các khóa học đã xuất bản (Dành cho User)
  static async getPublishedCourses() {
    const query = `SELECT * FROM courses WHERE status = 'published' ORDER BY created_at DESC`;
    const { rows } = await db.query(query);
    return rows;
  }

  // Lấy chi tiết 1 khóa học theo ID
  static async getCourseById(id) {
    const query = `SELECT * FROM courses WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Cập nhật khóa học
  static async updateCourse(id, title, description, status) {
    const query = `
            UPDATE courses 
            SET title = $1, description = $2, status = $3 
            WHERE id = $4 RETURNING *
        `;
    const { rows } = await db.query(query, [title, description, status, id]);
    return rows[0];
  }

  // Xóa khóa học
  static async deleteCourse(id) {
    const query = `DELETE FROM courses WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = CourseRepository;
