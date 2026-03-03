const db = require("../configs/db");

class UserProgressRepository {
  static async checkEnrollment(userId, courseId) {
    const query = `
        SELECT id FROM user_course_progress 
        WHERE user_id = $1 AND course_id = $2
    `;
    const { rows } = await db.query(query, [userId, courseId]);
    return rows[0]; // Trả về undefined nếu chưa đăng ký
  }

  // Tạo bản ghi tiến độ mới (Đăng ký khóa học)
  static async enrollCourse(userId, courseId) {
    const query = `
        INSERT INTO user_course_progress (user_id, course_id, progress_percentage, earned_points)
        VALUES ($1, $2, 0.00, 0)
        RETURNING *
    `;
    const { rows } = await db.query(query, [userId, courseId]);
    return rows[0];
  }

  // Hàm cộng dồn điểm vào khóa học cụ thể
  static async addCourseEarnedPoints(userId, courseId, pointsToAdd) {
    const query = `
            UPDATE user_course_progress 
            SET earned_points = earned_points + $1
            WHERE user_id = $2 AND course_id = $3 
            RETURNING *
        `;
    const { rows } = await db.query(query, [pointsToAdd, userId, courseId]);
    return rows[0]; // Trả về undefined nếu user chưa đăng ký khóa học này
  }

  static async getUserEnrolledCourses(userId) {
    const query = `
            SELECT c.id, c.title, c.description, ucp.progress_percentage, ucp.earned_points, ucp.last_accessed
            FROM user_course_progress ucp
            JOIN courses c ON ucp.course_id = c.id
            WHERE ucp.user_id = $1
            ORDER BY ucp.last_accessed DESC
        `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  }

  // Lấy danh sách trạng thái của tất cả Bài học trong 1 Khóa học của User
  static async getLessonProgressByCourse(userId, courseId) {
    const query = `
            SELECT l.id AS lesson_id, l.title, l.order_index, 
                   COALESCE(ulp.status, 'learning') AS status, 
                   ulp.completed_at
            FROM lessons l
            LEFT JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id AND ulp.user_id = $1
            WHERE l.course_id = $2
            ORDER BY l.order_index ASC
        `;
    const { rows } = await db.query(query, [userId, courseId]);
    return rows;
  }

  // Đánh dấu 1 Bài học là đã hoàn thành (Dùng ON CONFLICT của PostgreSQL)
  static async markLessonCompleted(userId, lessonId) {
    const query = `
            INSERT INTO user_lesson_progress (user_id, lesson_id, status, completed_at)
            VALUES ($1, $2, 'completed', NOW())
            ON CONFLICT (user_id, lesson_id) 
            DO UPDATE SET status = 'completed', completed_at = NOW()
            RETURNING *
        `;
    const { rows } = await db.query(query, [userId, lessonId]);
    return rows[0];
  }

  // Cập nhật phần trăm tiến độ của khóa học
  static async updateCourseProgressPercentage(userId, courseId, percentage) {
    const query = `
            UPDATE user_course_progress 
            SET progress_percentage = $1 
            WHERE user_id = $2 AND course_id = $3
            RETURNING progress_percentage
        `;
    const { rows } = await db.query(query, [percentage, userId, courseId]);
    return rows[0];
  }
}

module.exports = UserProgressRepository;
