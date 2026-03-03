const express = require("express");
const router = express.Router();
const ProgressController = require("../controllers/progressController");
const { authenticate } = require("../middlewares/auth");

// Bắt buộc đăng nhập cho tất cả các route này
router.use(authenticate);
router.post("/courses/:courseId/enroll", ProgressController.enrollCourse);
// Lấy danh sách các khóa đang học (Có kèm phần trăm tiến độ và điểm)
router.get("/courses", ProgressController.getMyCourses);

// Xem chi tiết tiến độ từng bài học (Xanh/Xám) trong 1 khóa cụ thể
router.get("/courses/:courseId", ProgressController.getMyCourseProgress);

// Bấm nút "Hoàn thành bài học" (Sẽ tự động cập nhật lại % của khóa học)
router.post("/lessons/:lessonId/complete", ProgressController.completeLesson);

module.exports = router;
