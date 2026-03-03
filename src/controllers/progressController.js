const ProgressService = require("../services/progressService");

class ProgressController {
  static async enrollCourse(req, res) {
    try {
      const userId = req.user.userId; // Lấy từ token đăng nhập
      const { courseId } = req.params;

      const enrollment = await ProgressService.enrollCourse(userId, courseId);

      res.status(201).json({
        success: true,
        message:
          "Đăng ký khóa học thành công! Bạn có thể bắt đầu học ngay bây giờ.",
        data: enrollment,
      });
    } catch (error) {
      // Lỗi 400 cho các trường hợp nghiệp vụ (đã đăng ký rồi, khóa học nháp...)
      res.status(400).json({ success: false, message: error.message });
    }
  }
  // API Lấy danh sách khóa học user đang học
  static async getMyCourses(req, res) {
    try {
      const userId = req.user.userId; // Từ JWT token
      const courses = await ProgressService.getUserEnrolledCourses(userId);
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // API Xem chi tiết tiến độ các bài học trong 1 khóa
  static async getMyCourseProgress(req, res) {
    try {
      const userId = req.user.userId;
      const { courseId } = req.params;
      const progress = await ProgressService.getCourseProgress(
        userId,
        courseId,
      );
      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // API Đánh dấu hoàn thành 1 bài học
  static async completeLesson(req, res) {
    try {
      const userId = req.user.userId;
      const { lessonId } = req.params;
      const result = await ProgressService.markLessonAsCompleted(
        userId,
        lessonId,
      );

      res.status(200).json({
        success: true,
        message: "Đã hoàn thành bài học!",
        data: result,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = ProgressController;
