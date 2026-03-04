const UserRepository = require("../repositories/userRepository");

class UserController {
  // [GET] /api/users
  static async getAllUsers(req, res) {
    try {
      const users = await UserRepository.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách user:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ nội bộ",
      });
    }
  }

  // [PUT] /api/users/:id
  static async updateUserAdmin(req, res) {
    try {
      const { id } = req.params;
      const { role, current_level, total_points } = req.body;

      // Chặn việc tự hạ quyền của chính mình (nếu Admin đang đăng nhập tự sửa chính họ thành user)
      if (req.user.id === parseInt(id) && role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Bạn không thể tự hạ quyền quản trị của chính mình!",
        });
      }

      const updatedUser = await UserRepository.updateUserByAdmin(
        id,
        role,
        current_level || 1,
        total_points || 0,
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng",
        });
      }

      res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Lỗi cập nhật user:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ nội bộ",
      });
    }
  }

  // [DELETE] /api/users/:id
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Bảo mật: Không cho phép Admin tự xóa chính mình
      if (req.user.id === parseInt(id)) {
        return res.status(403).json({
          success: false,
          message: "Bạn không thể tự xóa tài khoản của chính mình!",
        });
      }

      const deletedUser = await UserRepository.deleteUser(id);

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng để xóa",
        });
      }

      res.status(200).json({
        success: true,
        message: "Xóa tài khoản thành công",
      });
    } catch (error) {
      console.error("Lỗi xóa user:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ nội bộ",
      });
    }
  }
}

module.exports = UserController;
