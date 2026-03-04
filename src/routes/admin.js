const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const { authenticate, authorizeAdmin } = require("../middlewares/auth");

// GET /api/admin/stats
router.get(
  "/stats",
  authenticate,
  authorizeAdmin,
  AdminController.getDashboardStats,
);

module.exports = router;
