const VocabularyService = require("../services/vocabularyService");

class VocabularyController {
  static async createVocabulary(req, res) {
    try {
      const newVocab = await VocabularyService.createVocabulary(req.body);
      res
        .status(201)
        .json({
          success: true,
          message: "Thêm từ vựng thành công",
          data: newVocab,
        });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getVocabulariesByLesson(req, res) {
    try {
      const { lessonId } = req.params;
      const vocabularies =
        await VocabularyService.getVocabulariesByLessonId(lessonId);
      res.status(200).json({ success: true, data: vocabularies });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getVocabularyById(req, res) {
    try {
      const { id } = req.params;
      const vocab = await VocabularyService.getVocabularyById(id);
      res.status(200).json({ success: true, data: vocab });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async updateVocabulary(req, res) {
    try {
      const { id } = req.params;
      const updatedVocab = await VocabularyService.updateVocabulary(
        id,
        req.body,
      );
      res
        .status(200)
        .json({
          success: true,
          message: "Cập nhật thành công",
          data: updatedVocab,
        });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteVocabulary(req, res) {
    try {
      const { id } = req.params;
      await VocabularyService.deleteVocabulary(id);
      res
        .status(200)
        .json({ success: true, message: "Xóa từ vựng thành công" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = VocabularyController;
