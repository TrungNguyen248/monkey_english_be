const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authenticate, authorizeAdmin } = require("../middlewares/auth");

// Tất cả các route quản lý user đều yêu cầu đăng nhập (authenticate) và là Admin (authorizeAdmin)

// Lấy danh sách toàn bộ người dùng
router.get("/", authenticate, authorizeAdmin, UserController.getAllUsers);

// Cập nhật thông tin người dùng (Role, Level, Points)
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  UserController.updateUserAdmin,
);

// Xóa tài khoản người dùng
router.delete("/:id", authenticate, authorizeAdmin, UserController.deleteUser);

module.exports = router;
