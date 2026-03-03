const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/quizController");
const { authenticate, authorizeAdmin } = require("../middlewares/auth");

// --- CÁC API DÀNH CHO USER ---

// Lấy danh sách các bài Quiz có trong 1 Lesson
router.get("/lesson/:lessonId", QuizController.getQuizzesByLesson);
router.post("/:id/submit", authenticate, QuizController.submitQuiz);
// Lấy chi tiết toàn bộ nội dung 1 bài Quiz (Kèm theo Câu hỏi và Đáp án để User làm bài)
// Chú ý: Cần qua middleware authenticate để server biết là User (ẩn đáp án đúng) hay Admin (hiện đáp án đúng)
router.get("/:id/full", authenticate, QuizController.getFullQuizDetails);

// --- CÁC API DÀNH RIÊNG CHO ADMIN ---
// Tạo mới một Quiz
router.post("/", authenticate, authorizeAdmin, QuizController.createQuiz);

// Cập nhật thông số Quiz (Tên, điểm sàn, điểm thưởng)
router.put("/:id", authenticate, authorizeAdmin, QuizController.updateQuiz);

// Xóa Quiz (Sẽ tự động xóa các Questions và Answers do có CASCADE ở DB)
router.delete("/:id", authenticate, authorizeAdmin, QuizController.deleteQuiz);

module.exports = router;
