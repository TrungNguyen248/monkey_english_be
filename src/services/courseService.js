const CourseRepository = require("../repositories/courseRepository");

class CourseService {
  // Logic tạo khóa học
  static async createCourse(data) {
    const { title, description, status } = data;
    if (!title) throw new Error("Tiêu đề khóa học là bắt buộc!");

    // Mặc định status là draft nếu không truyền
    const courseStatus = status || "draft";
    return await CourseRepository.createCourse(
      title,
      description,
      courseStatus,
    );
  }

  // Lấy danh sách khóa học dựa theo Role
  static async getCourses(userRole) {
    if (userRole === "admin") {
      return await CourseRepository.getAllCourses();
    } else {
      return await CourseRepository.getPublishedCourses();
    }
  }

  // Lấy chi tiết khóa học
  static async getCourseById(id, userRole) {
    const course = await CourseRepository.getCourseById(id);
    if (!course) throw new Error("Không tìm thấy khóa học!");

    // User bình thường không được xem khóa học đang lưu nháp (draft)
    if (userRole !== "admin" && course.status === "draft") {
      throw new Error("Khóa học này chưa được xuất bản!");
    }

    return course;
  }

  // Cập nhật khóa học
  static async updateCourse(id, data) {
    const { title, description, status } = data;

    // Kiểm tra xem khóa học có tồn tại không
    const existingCourse = await CourseRepository.getCourseById(id);
    if (!existingCourse)
      throw new Error("Không tìm thấy khóa học để cập nhật!");

    return await CourseRepository.updateCourse(
      id,
      title || existingCourse.title,
      description || existingCourse.description,
      status || existingCourse.status,
    );
  }

  // Xóa khóa học
  static async deleteCourse(id) {
    const existingCourse = await CourseRepository.getCourseById(id);
    if (!existingCourse) throw new Error("Không tìm thấy khóa học để xóa!");

    return await CourseRepository.deleteCourse(id);
  }
}

module.exports = CourseService;
