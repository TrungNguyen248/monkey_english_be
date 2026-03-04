const CourseRepository = require("../repositories/courseRepository");
const CourseService = require("../services/courseService");

class CourseController {
  static async createCourse(req, res) {
    try {
      const newCourse = await CourseService.createCourse(req.body);
      res.status(201).json({
        success: true,
        message: "Tạo khóa học thành công",
        data: newCourse,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAllPublishedCourses(req, res) {
    try {
      const { search, tag } = req.query; // Nhận query từ Frontend
      const courses = await CourseRepository.getPublishedCourses(search, tag);
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCourses(req, res) {
    try {
      // Lấy role từ token (nếu user chưa đăng nhập, mặc định coi như 'guest')
      const userRole = req.user ? req.user.role : "guest";

      const courses = await CourseService.getCourses(userRole);
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllCoursesAdmin(req, res) {
    try {
      const courses = await CourseRepository.getAllCoursesForAdmin();
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const userRole = req.user ? req.user.role : "guest";

      const course = await CourseService.getCourseById(id, userRole);
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const updatedCourse = await CourseService.updateCourse(id, req.body);
      res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
        data: updatedCourse,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      await CourseService.deleteCourse(id);
      res
        .status(200)
        .json({ success: true, message: "Xóa khóa học thành công" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = CourseController;
