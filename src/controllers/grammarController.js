const GrammarService = require("../services/grammarService");

class GrammarController {
  static async createGrammar(req, res) {
    try {
      const newGrammar = await GrammarService.createGrammar(req.body);
      res.status(201).json({
        success: true,
        message: "Thêm ngữ pháp thành công",
        data: newGrammar,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getGrammarsByLesson(req, res) {
    try {
      const { lessonId } = req.params;
      const grammars = await GrammarService.getGrammarsByLessonId(lessonId);
      res.status(200).json({ success: true, data: grammars });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getGrammarById(req, res) {
    try {
      const { id } = req.params;
      const grammar = await GrammarService.getGrammarById(id);
      res.status(200).json({ success: true, data: grammar });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async updateGrammar(req, res) {
    try {
      const { id } = req.params;
      const updatedGrammar = await GrammarService.updateGrammar(id, req.body);
      res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
        data: updatedGrammar,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteGrammar(req, res) {
    try {
      const { id } = req.params;
      await GrammarService.deleteGrammar(id);
      res
        .status(200)
        .json({ success: true, message: "Xóa ngữ pháp thành công" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = GrammarController;
