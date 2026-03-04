const db = require("../configs/db");

class AdminController {
  static async getDashboardStats(req, res) {
    try {
      // Dùng Sub-queries để lấy tất cả thống kê trong 1 lần gọi DB
      const query = `
                SELECT 
                    (SELECT COUNT(*) FROM courses) AS total_courses,
                    (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_students,
                    (SELECT COUNT(*) FROM user_lesson_progress) AS total_completed_lessons,
                    (SELECT COALESCE(SUM(total_points), 0) FROM users WHERE role = 'user') AS total_system_points
            `;
      const { rows } = await db.query(query);

      res.status(200).json({
        success: true,
        data: rows[0],
      });
    } catch (error) {
      console.error("Lỗi khi lấy thống kê Admin:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  }
}

module.exports = AdminController;
