const UserRepository = require("../repositories/userRepository");
const LeaderboardService = require("../services/leaderboardService");

class LeaderboardController {
  static async getLeaderboard(req, res) {
    try {
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
  static async getMyRank(req, res) {
    try {
      const userId = req.user.userId;
      const rank = await UserRepository.getUserRank(userId);

      res.status(200).json({
        success: true,
        data: { rank: rank || "Chưa có hạng" },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  }
}

module.exports = LeaderboardController;
