const ProgressRepository = require("../repositories/userProgressRepository");
const LessonRepository = require("../repositories/lessonRepository");
const CourseRepository = require("../repositories/courseRepository");

class ProgressService {
  static async enrollCourse(userId, courseId) {
    // 1. Kiểm tra khóa học có tồn tại và đang mở (published) không
    const course = await CourseRepository.getCourseById(courseId);
    if (!course) {
      throw new Error("Khóa học không tồn tại!");
    }
    if (course.status !== "published") {
      throw new Error("Khóa học này chưa được mở để đăng ký!");
    }

    // 2. Kiểm tra xem User đã đăng ký trước đó chưa
    const isEnrolled = await ProgressRepository.checkEnrollment(
      userId,
      courseId,
    );
    if (isEnrolled) {
      throw new Error("Bạn đã đăng ký tham gia khóa học này rồi!");
    }

    // 3. Tiến hành ghi danh (Tạo bản ghi progress)
    return await ProgressRepository.enrollCourse(userId, courseId);
  }
  static async getUserEnrolledCourses(userId) {
    return await ProgressRepository.getUserEnrolledCourses(userId);
  }

  static async getCourseProgress(userId, courseId) {
    // Trả về danh sách bài học kèm trạng thái để FE tô màu Xanh/Xám cho bài học
    return await ProgressRepository.getLessonProgressByCourse(userId, courseId);
  }

  static async markLessonAsCompleted(userId, lessonId) {
    // 1. Kiểm tra lesson có tồn tại không và thuộc course nào
    const lesson = await LessonRepository.getLessonById(lessonId);
    if (!lesson) throw new Error("Bài học không tồn tại!");

    const courseId = lesson.course_id;

    // 2. Đánh dấu lesson này là completed
    await ProgressRepository.markLessonCompleted(userId, lessonId);

    // 3. TÍNH TOÁN LẠI PHẦN TRĂM HOÀN THÀNH (PROGRESS PERCENTAGE)
    // Lấy tất cả bài học của khóa này
    const allLessons = await LessonRepository.getLessonsByCourseId(courseId);
    const totalLessons = allLessons.length;

    // Lấy trạng thái học tập của user cho khóa này
    const userLessons = await ProgressRepository.getLessonProgressByCourse(
      userId,
      courseId,
    );

    // Đếm số bài đã học xong
    const completedLessons = userLessons.filter(
      (l) => l.status === "completed",
    ).length;

    // Tính %
    let percentage = 0;
    if (totalLessons > 0) {
      percentage = (completedLessons / totalLessons) * 100;
    }

    // Làm tròn 2 chữ số thập phân
    percentage = Math.round(percentage * 100) / 100;

    // 4. Cập nhật vào bảng user_course_progress
    const updatedCourse =
      await ProgressRepository.updateCourseProgressPercentage(
        userId,
        courseId,
        percentage,
      );

    return {
      lesson_id: lessonId,
      status: "completed",
      course_id: courseId,
      new_progress_percentage: updatedCourse
        ? updatedCourse.progress_percentage
        : 0,
    };
  }
}

module.exports = ProgressService;
