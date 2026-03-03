const express = require("express");
const router = express.Router();
const LessonController = require("../controllers/lessonController");
const { authenticate, authorizeAdmin } = require("../middlewares/auth");

// --- CÁC API DÀNH CHO USER (Hoặc Public) ---
// Lấy danh sách bài học của 1 khóa học (VD: GET /api/lessons/course/5)
router.get("/course/:courseId", LessonController.getLessonsByCourse);

// Lấy chi tiết 1 bài học (VD: GET /api/lessons/10)
router.get("/:id", LessonController.getLessonById);

// --- CÁC API DÀNH RIÊNG CHO ADMIN ---
// Thêm bài học mới (course_id truyền trong body)
router.post("/", authenticate, authorizeAdmin, LessonController.createLesson);

// Cập nhật bài học
router.put("/:id", authenticate, authorizeAdmin, LessonController.updateLesson);

// Xóa bài học
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  LessonController.deleteLesson,
);

module.exports = router;
