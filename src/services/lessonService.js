const LessonRepository = require("../repositories/lessonRepository");
const CourseRepository = require("../repositories/courseRepository"); // Import để check course

class LessonService {
  // Tạo bài học mới
  static async createLesson(data) {
    const { course_id, title, order_index, points_reward } = data;

    if (!course_id || !title || order_index === undefined) {
      throw new Error("Vui lòng cung cấp đủ course_id, title và order_index!");
    }

    // Kiểm tra xem Khóa học có tồn tại không
    const course = await CourseRepository.getCourseById(course_id);
    if (!course) {
      throw new Error("Khóa học không tồn tại!");
    }

    const points = points_reward || 0; // Mặc định là 0 điểm nếu không nhập

    return await LessonRepository.createLesson(
      course_id,
      title,
      order_index,
      points,
    );
  }

  // Lấy danh sách bài học theo courseId
  static async getLessonsByCourseId(courseId) {
    // Có thể check thêm xem course có tồn tại không nếu muốn chặt chẽ
    return await LessonRepository.getLessonsByCourseId(courseId);
  }

  // Lấy chi tiết bài học
  static async getLessonById(id) {
    const lesson = await LessonRepository.getLessonById(id);
    if (!lesson) throw new Error("Không tìm thấy bài học!");
    return lesson;
  }

  // Cập nhật bài học
  static async updateLesson(id, data) {
    const { title, order_index, points_reward } = data;

    const existingLesson = await LessonRepository.getLessonById(id);
    if (!existingLesson) throw new Error("Không tìm thấy bài học để cập nhật!");

    return await LessonRepository.updateLesson(
      id,
      title || existingLesson.title,
      order_index !== undefined ? order_index : existingLesson.order_index,
      points_reward !== undefined
        ? points_reward
        : existingLesson.points_reward,
    );
  }

  // Xóa bài học
  static async deleteLesson(id) {
    const existingLesson = await LessonRepository.getLessonById(id);
    if (!existingLesson) throw new Error("Không tìm thấy bài học để xóa!");

    return await LessonRepository.deleteLesson(id);
  }
}

module.exports = LessonService;
