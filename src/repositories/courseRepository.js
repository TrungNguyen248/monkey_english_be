const db = require("../configs/db");

class CourseRepository {
  // Thêm khóa học mới
  static async createCourse(title, description, status, tags = []) {
    const query = `INSERT INTO courses (title, description, status, tags) VALUES ($1, $2, $3, $4) RETURNING *`;
    const { rows } = await db.query(query, [title, description, status, tags]);
    return rows[0];
  }

  // Lấy tất cả khóa học (Dành cho Admin)
  static async getAllCourses() {
    const query = `SELECT * FROM courses ORDER BY created_at DESC`;
    const { rows } = await db.query(query);
    return rows;
  }

  static async getAllCoursesForAdmin() {
    const query = `SELECT * FROM courses ORDER BY created_at DESC`;
    const { rows } = await db.query(query);
    return rows;
  }

  // Lấy các khóa học đã xuất bản (Dành cho User)
  static async getPublishedCourses(search = "", tag = "") {
    let query = `SELECT * FROM courses WHERE status = 'published'`;
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND title ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (tag) {
      // Sử dụng hàm EXISTS kết hợp UNNEST và LOWER để so sánh mảng không phân biệt hoa thường
      query += ` AND EXISTS (
                SELECT 1 FROM unnest(tags) t 
                WHERE LOWER(t) = LOWER($${paramIndex})
            )`;
      params.push(tag);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;
    const { rows } = await db.query(query, params);
    return rows;
  }

  // Lấy chi tiết 1 khóa học theo ID
  static async getCourseById(id) {
    const query = `SELECT * FROM courses WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Cập nhật khóa học
  static async updateCourse(id, title, description, status, tags = []) {
    const query = `UPDATE courses SET title = $1, description = $2, status = $3, tags = $4 WHERE id = $5 RETURNING *`;
    const { rows } = await db.query(query, [
      title,
      description,
      status,
      tags,
      id,
    ]);
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
