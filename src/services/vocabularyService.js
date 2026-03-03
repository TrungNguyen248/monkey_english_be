const VocabularyRepository = require("../repositories/vocabularyRepository");
const LessonRepository = require("../repositories/lessonRepository"); // Import để check lesson_id

class VocabularyService {
  // Tạo từ vựng mới
  static async createVocabulary(data) {
    const { lesson_id, word, meaning } = data;

    if (!lesson_id || !word || !meaning) {
      throw new Error(
        "Vui lòng cung cấp đủ lesson_id, word (từ vựng) và meaning (nghĩa)!",
      );
    }

    // Kiểm tra xem Bài học (Lesson) có tồn tại không
    const lesson = await LessonRepository.getLessonById(lesson_id);
    if (!lesson) {
      throw new Error("Bài học không tồn tại trong hệ thống!");
    }

    return await VocabularyRepository.createVocabulary(data);
  }

  // Lấy danh sách từ vựng theo lessonId
  static async getVocabulariesByLessonId(lessonId) {
    return await VocabularyRepository.getVocabulariesByLessonId(lessonId);
  }

  // Lấy chi tiết 1 từ vựng
  static async getVocabularyById(id) {
    const vocab = await VocabularyRepository.getVocabularyById(id);
    if (!vocab) throw new Error("Không tìm thấy từ vựng!");
    return vocab;
  }

  // Cập nhật từ vựng
  static async updateVocabulary(id, data) {
    const existingVocab = await VocabularyRepository.getVocabularyById(id);
    if (!existingVocab) throw new Error("Không tìm thấy từ vựng để cập nhật!");

    // Gộp dữ liệu mới và cũ (nếu field nào không gửi lên thì giữ nguyên field cũ)
    const updatedData = {
      word: data.word || existingVocab.word,
      word_type:
        data.word_type !== undefined ? data.word_type : existingVocab.word_type,
      meaning: data.meaning || existingVocab.meaning,
      pronunciation:
        data.pronunciation !== undefined
          ? data.pronunciation
          : existingVocab.pronunciation,
      example_en:
        data.example_en !== undefined
          ? data.example_en
          : existingVocab.example_en,
      example_vi:
        data.example_vi !== undefined
          ? data.example_vi
          : existingVocab.example_vi,
    };

    return await VocabularyRepository.updateVocabulary(id, updatedData);
  }

  // Xóa từ vựng
  static async deleteVocabulary(id) {
    const existingVocab = await VocabularyRepository.getVocabularyById(id);
    if (!existingVocab) throw new Error("Không tìm thấy từ vựng để xóa!");

    return await VocabularyRepository.deleteVocabulary(id);
  }
}

module.exports = VocabularyService;
