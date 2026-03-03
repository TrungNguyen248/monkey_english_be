const express = require("express");
const router = express.Router();
const QARepository = require("../repositories/qaRepository");
const { authenticate, authorizeAdmin } = require("../middlewares/auth");

// === CHỈ ADMIN MỚI ĐƯỢC THÊM/XÓA CÂU HỎI & ĐÁP ÁN ===
router.use(authenticate, authorizeAdmin);

// [POST] /api/qa/questions - Thêm câu hỏi vào Quiz
router.post("/questions", async (req, res) => {
  try {
    const { quiz_id, content, question_type } = req.body;
    const newQuestion = await QARepository.createQuestion(
      quiz_id,
      content,
      question_type,
    );
    res.status(201).json({ success: true, data: newQuestion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// [POST] /api/qa/answers - Thêm đáp án cho Câu hỏi
router.post("/answers", async (req, res) => {
  try {
    const { question_id, content, is_correct } = req.body;
    const newAnswer = await QARepository.createAnswer(
      question_id,
      content,
      is_correct,
    );
    res.status(201).json({ success: true, data: newAnswer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
