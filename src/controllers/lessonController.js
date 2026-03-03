const LessonService = require("../services/lessonService");

class LessonController {
  static async createLesson(req, res) {
    try {
      const newLesson = await LessonService.createLesson(req.body);
      res
        .status(201)
        .json({
          success: true,
          message: "Tạo bài học thành công",
          data: newLesson,
        });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getLessonsByCourse(req, res) {
    try {
      const { courseId } = req.params;
      const lessons = await LessonService.getLessonsByCourseId(courseId);
      res.status(200).json({ success: true, data: lessons });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getLessonById(req, res) {
    try {
      const { id } = req.params;
      const lesson = await LessonService.getLessonById(id);
      res.status(200).json({ success: true, data: lesson });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async updateLesson(req, res) {
    try {
      const { id } = req.params;
      const updatedLesson = await LessonService.updateLesson(id, req.body);
      res
        .status(200)
        .json({
          success: true,
          message: "Cập nhật thành công",
          data: updatedLesson,
        });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteLesson(req, res) {
    try {
      const { id } = req.params;
      await LessonService.deleteLesson(id);
      res
        .status(200)
        .json({ success: true, message: "Xóa bài học thành công" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = LessonController;
