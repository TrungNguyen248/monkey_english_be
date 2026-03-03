const express = require("express");
const router = express.Router();
const VocabularyController = require("../controllers/vocabularyController");
const { authenticate, authorizeAdmin } = require("../middlewares/auth");

// --- CÁC API DÀNH CHO USER / BÊN NGOÀI ---
// Lấy toàn bộ từ vựng của 1 bài học (VD: GET /api/vocabularies/lesson/10)
router.get("/lesson/:lessonId", VocabularyController.getVocabulariesByLesson);

// Lấy chi tiết 1 từ vựng (VD: GET /api/vocabularies/5)
router.get("/:id", VocabularyController.getVocabularyById);

// --- CÁC API DÀNH RIÊNG CHO ADMIN ---
// Thêm từ vựng mới (lesson_id truyền trong body req)
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  VocabularyController.createVocabulary,
);

// Cập nhật từ vựng
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  VocabularyController.updateVocabulary,
);

// Xóa từ vựng
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  VocabularyController.deleteVocabulary,
);

module.exports = router;
