const express = require("express");
const router = express.Router();
const CourseController = require("../controllers/courseController");
const { authenticate, authorizeAdmin } = require("../middlewares/auth");

// --- CÁC API DÀNH CHO TẤT CẢ MỌI NGƯỜI (Hoặc User đã đăng nhập) ---
// Tùy chọn: Bạn có thể viết 1 middleware riêng để parse token nhưng không báo lỗi nếu không có token (optional auth)
// Ở đây ta giả sử nếu API công khai, ta gọi thẳng controller. Bạn nên cấu hình middleware lấy req.user nếu có token.
router.get("/", CourseController.getCourses);
router.get("/:id", CourseController.getCourseById);

// --- CÁC API DÀNH RIÊNG CHO ADMIN ---
// Phải chạy qua authenticate (để lấy req.user) -> authorizeAdmin (để check role === 'admin')
router.post("/", authenticate, authorizeAdmin, CourseController.createCourse);
router.put("/:id", authenticate, authorizeAdmin, CourseController.updateCourse);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  CourseController.deleteCourse,
);

module.exports = router;
