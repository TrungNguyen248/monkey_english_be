const ProgressRepository = require("../repositories/userProgressRepository");
const LessonRepository = require("../repositories/lessonRepository");
const CourseRepository = require("../repositories/courseRepository");
const UserRepository = require("../repositories/userRepository");
const { calculateLevel } = require("../utils/levelHelper");

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
    const isCompleted = await ProgressRepository.checkLessonCompleted(
      userId,
      lessonId,
    );

    // Nếu đã làm rồi thì không cộng điểm nữa
    if (isCompleted) {
      return {
        pointsEarned: 0,
        newStats: null,
      };
    }

    // 2. Đánh dấu hoàn thành bài học
    await ProgressRepository.markLessonCompleted(userId, lessonId);

    // 3. Lấy điểm thưởng của bài học
    const pointsEarned = await LessonRepository.getLessonPoints(lessonId);
    let newStats = null;

    // 4. Xử lý cộng điểm và tính cấp độ mới (Nếu bài học có điểm thưởng)
    if (pointsEarned > 0) {
      const currentPoints = await UserRepository.getUserPoints(userId);
      const newTotalPoints = currentPoints + pointsEarned;
      const newLevel = calculateLevel(newTotalPoints);

      // Cập nhật điểm và cấp độ vào Database
      newStats = await UserRepository.addPointsAndLevel(
        userId,
        pointsEarned,
        newLevel,
      );
    }

    return {
      pointsEarned,
      newStats,
    };
  }
}

module.exports = ProgressService;
