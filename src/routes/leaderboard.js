const express = require("express");
const router = express.Router();
const LeaderboardController = require("../controllers/leaderboardController");
const { authenticate } = require("../middlewares/auth");

// [GET] /api/leaderboard?limit=10
// Yêu cầu đăng nhập để biết luôn hạng của mình
router.get("/", authenticate, LeaderboardController.getLeaderboard);

module.exports = router;
