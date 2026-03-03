const QuizService = require("../services/quizService");

class QuizController {
  static async createQuiz(req, res) {
    try {
      const newQuiz = await QuizService.createQuiz(req.body);
      res.status(201).json({
        success: true,
        message: "Tạo bài tập thành công",
        data: newQuiz,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getQuizzesByLesson(req, res) {
    try {
      const { lessonId } = req.params;
      const quizzes = await QuizService.getQuizzesByLessonId(lessonId);
      res.status(200).json({ success: true, data: quizzes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // API này trả về toàn bộ cấu trúc Đề bài > Câu hỏi > Đáp án
  static async getFullQuizDetails(req, res) {
    try {
      const { id } = req.params;
      // Lấy role từ token, mặc định là 'user' nếu có cấu hình middleware không bắt buộc
      const userRole = req.user ? req.user.role : "user";

      const quizData = await QuizService.getFullQuizDetails(id, userRole);
      res.status(200).json({ success: true, data: quizData });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async updateQuiz(req, res) {
    try {
      const { id } = req.params;
      const updatedQuiz = await QuizService.updateQuiz(id, req.body);
      res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
        data: updatedQuiz,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteQuiz(req, res) {
    try {
      const { id } = req.params;
      await QuizService.deleteQuiz(id);
      res
        .status(200)
        .json({ success: true, message: "Xóa bài tập thành công" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  static async submitQuiz(req, res) {
    try {
      const userId = req.user.userId; // Lấy từ token đã đăng nhập
      const { id: quizId } = req.params;
      const { answers } = req.body; // Mảng đáp án học viên gửi lên

      if (!Array.isArray(answers)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Dữ liệu answers phải là một mảng!",
          });
      }

      const submitResult = await QuizService.submitQuiz(
        userId,
        quizId,
        answers,
      );

      res.status(200).json({
        success: true,
        message: submitResult.is_passed
          ? "Chúc mừng! Bạn đã vượt qua bài tập."
          : "Rất tiếc, bạn chưa đạt điểm yêu cầu.",
        data: submitResult,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = QuizController;
