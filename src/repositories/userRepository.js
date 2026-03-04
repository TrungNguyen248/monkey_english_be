const db = require("../configs/db");

class UserRepository {
  // Tìm user theo email
  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  // Tìm user theo username
  static async findByUsername(username) {
    const query = `SELECT * FROM users WHERE username = $1`;
    const { rows } = await db.query(query, [username]);
    return rows[0];
  }

  // Tạo user mới
  static async createUser(username, email, passwordHash) {
    const query = `
            INSERT INTO users (username, email, password_hash) 
            VALUES ($1, $2, $3) 
            RETURNING id, username, email, role, total_points, current_level, created_at
        `;
    const { rows } = await db.query(query, [username, email, passwordHash]);
    return rows[0];
  }

  static async addPointsAndLevelUp(userId, pointsToAdd) {
    // Lấy thông tin điểm hiện tại
    const userQuery = `SELECT total_points FROM users WHERE id = $1`;
    const userResult = await db.query(userQuery, [userId]);
    const currentPoints = userResult.rows[0].total_points;

    const newTotalPoints = currentPoints + pointsToAdd;

    // Tính toán Level mới (VD: Cứ 100 điểm thì lên 1 cấp)
    const newLevel = Math.floor(newTotalPoints / 100) + 1;

    // Cập nhật lại vào DB
    const updateQuery = `
        UPDATE users 
        SET total_points = $1, current_level = $2 
        WHERE id = $3 RETURNING total_points, current_level
    `;
    const { rows } = await db.query(updateQuery, [
      newTotalPoints,
      newLevel,
      userId,
    ]);
    return rows[0];
  }

  static async getTopUsers(limit = 10) {
    const query = `
        SELECT id, username, total_points, current_level, created_at
        FROM users
        WHERE role = 'user'
        ORDER BY total_points DESC
        LIMIT $1
    `;
    const { rows } = await db.query(query, [limit]);
    return rows;
  }

  // 2. Tìm thứ hạng (Rank) của 1 User cụ thể bằng RANK() OVER
  static async getUserRank(userId) {
    const query = `
        SELECT rank FROM (
            SELECT id, RANK() OVER (ORDER BY total_points DESC) as rank
            FROM users
            WHERE role = 'user'
        ) subquery
        WHERE id = $1
    `;
    const { rows } = await db.query(query, [userId]);
    // Trả về số hạng (kiểu int) hoặc null nếu không tìm thấy
    return rows.length > 0 ? parseInt(rows[0].rank, 10) : null;
  }

  static async getAllUsers() {
    // Không lấy mật khẩu (password) để đảm bảo bảo mật
    const query = `
            SELECT id, username, email, role, current_level, total_points, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;
    const { rows } = await db.query(query);
    return rows;
  }

  // 2. Cập nhật thông tin người dùng (Role, Level, Points)
  static async updateUserByAdmin(id, role, currentLevel, totalPoints) {
    const query = `
            UPDATE users 
            SET role = $1, current_level = $2, total_points = $3, updated_at = NOW()
            WHERE id = $4 
            RETURNING id, username, email, role, current_level, total_points
        `;
    const { rows } = await db.query(query, [
      role,
      currentLevel,
      totalPoints,
      id,
    ]);
    return rows[0];
  }

  // 3. Xóa người dùng
  static async deleteUser(id) {
    // Trong hệ thống thực tế, bạn nên dùng Soft Delete (đánh dấu is_deleted = true)
    // Nhưng ở đây ta dùng Hard Delete theo đúng luồng hiện tại
    const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
  static async getUserPoints(userId) {
    const query = `SELECT total_points FROM users WHERE id = $1`;
    const { rows } = await db.query(query, [userId]);
    return rows[0] ? rows[0].total_points : 0;
  }

  // Thêm hàm cập nhật điểm và level sau khi làm bài
  static async addPointsAndLevel(userId, pointsToAdd, newLevel) {
    const query = `
            UPDATE users 
            SET total_points = total_points + $1,
                current_level = $2,
                updated_at = NOW()
            WHERE id = $3
            RETURNING id, total_points, current_level
        `;
    const { rows } = await db.query(query, [pointsToAdd, newLevel, userId]);
    return rows[0];
  }
}

module.exports = UserRepository;
