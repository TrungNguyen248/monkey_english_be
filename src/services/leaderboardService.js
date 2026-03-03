const UserRepository = require("../repositories/userRepository");

class LeaderboardService {
  static async getGlobalLeaderboard(currentUserId = null, limit = 10) {
    // 1. Lấy Top 10 cao thủ
    const topUsers = await UserRepository.getTopUsers(limit);

    // 2. Nếu có User đang đăng nhập gọi API này, tìm luôn hạng của họ
    let currentUserRankInfo = null;
    if (currentUserId) {
      const rank = await UserRepository.getUserRank(currentUserId);
      // Lấy thêm thông tin detail của user đó trong list top 10 (nếu có)
      const userInTop = topUsers.find((u) => u.id === currentUserId);

      currentUserRankInfo = {
        user_id: currentUserId,
        rank: rank,
        is_in_top: !!userInTop,
      };
    }

    return {
      top_users: topUsers,
      current_user_ranking: currentUserRankInfo,
    };
  }
}

module.exports = LeaderboardService;
