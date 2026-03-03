const GrammarRepository = require("../repositories/grammarRepository");
const LessonRepository = require("../repositories/lessonRepository"); // Import để check lesson_id

class GrammarService {
  // Tạo ngữ pháp mới
  static async createGrammar(data) {
    const { lesson_id, title, structure } = data;

    if (!lesson_id || !title || !structure) {
      throw new Error(
        "Vui lòng cung cấp đủ lesson_id, title (ngữ pháp) và structure (cấu trúc)!",
      );
    }

    // Kiểm tra xem Bài học (Lesson) có tồn tại không
    const lesson = await LessonRepository.getLessonById(lesson_id);
    if (!lesson) {
      throw new Error("Bài học không tồn tại trong hệ thống!");
    }

    return await GrammarRepository.createGrammar(data);
  }

  // Lấy danh sách ngữ pháp theo lessonId
  static async getGrammarsByLessonId(lessonId) {
    return await GrammarRepository.getGrammarsByLessonId(lessonId);
  }

  // Lấy chi tiết 1 ngữ pháp
  static async getGrammarById(id) {
    const grammar = await GrammarRepository.getGrammarById(id);
    if (!grammar) throw new Error("Không tìm thấy ngữ pháp!");
    return grammar;
  }

  // Cập nhật ngữ pháp
  static async updateGrammar(id, data) {
    const existingGrammar = await GrammarRepository.getGrammarById(id);
    if (!existingGrammar)
      throw new Error("Không tìm thấy ngữ pháp để cập nhật!");

    // Gộp dữ liệu mới và cũ (nếu field nào không gửi lên thì giữ nguyên field cũ)
    const updatedData = {
      title: data.title || existingGrammar.title,
      structure:
        data.structure !== undefined
          ? data.structure
          : existingGrammar.structure,
      explanation: data.explanation || existingGrammar.explanation,
      example_en:
        data.example_en !== undefined
          ? data.example_en
          : existingGrammar.example_en,
      example_vi:
        data.example_vi !== undefined
          ? data.example_vi
          : existingGrammar.example_vi,
    };

    return await GrammarRepository.updateGrammar(id, updatedData);
  }

  // Xóa ngữ pháp
  static async deleteGrammar(id) {
    const existingGrammar = await GrammarRepository.getGrammarById(id);
    if (!existingGrammar) throw new Error("Không tìm thấy ngữ pháp để xóa!");

    return await GrammarRepository.deleteGrammar(id);
  }
}

module.exports = GrammarService;
