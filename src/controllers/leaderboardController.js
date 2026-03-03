const LeaderboardService = require("../services/leaderboardService");

class LeaderboardController {
  static async getLeaderboard(req, res) {
    try {
      // Rút trích userId nếu có truyền token (Giúp API này vừa có thể Public, vừa Private)
      // Nếu dùng middleware tùy chọn (optional auth), req.user có thể undefined
      const currentUserId = req.user ? req.user.userId : null;

      // Lấy tham số limit từ query string (VD: ?limit=20), mặc định là 10
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

      const leaderboardData = await LeaderboardService.getGlobalLeaderboard(
        currentUserId,
        limit,
      );

      res.status(200).json({
        success: true,
        message: "Lấy bảng xếp hạng thành công",
        data: leaderboardData,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = LeaderboardController;
