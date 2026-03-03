const express = require("express");
const router = express.Router();
const GrammarController = require("../controllers/grammarController");
const { authenticate, authorizeAdmin } = require("../middlewares/auth");

// --- CÁC API DÀNH CHO USER / BÊN NGOÀI ---
// Lấy toàn bộ ngữ pháp của 1 bài học (VD: GET /api/grammars/lesson/10)
router.get("/lesson/:lessonId", GrammarController.getGrammarsByLesson);

// Lấy chi tiết 1 ngữ pháp (VD: GET /api/grammars/5)
router.get("/:id", GrammarController.getGrammarById);

// --- CÁC API DÀNH RIÊNG CHO ADMIN ---
// Thêm ngữ pháp mới (lesson_id truyền trong body req)
router.post("/", authenticate, authorizeAdmin, GrammarController.createGrammar);

// Cập nhật ngữ pháp
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  GrammarController.updateGrammar,
);

// Xóa ngữ pháp
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  GrammarController.deleteGrammar,
);

module.exports = router;
