const AuthService = require("../services/authService");

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Basic validation ở tầng Controller
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Vui lòng điền đầy đủ thông tin!" });
      }

      // Gọi Service xử lý
      const newUser = await AuthService.registerUser({
        username,
        email,
        password,
      });

      return res.status(201).json({
        success: true,
        message: "Đăng ký tài khoản thành công",
        data: newUser,
      });
    } catch (error) {
      // error.message chính là lỗi được ném ra từ tầng Service
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Vui lòng nhập email và mật khẩu!",
          });
      }

      const loginResult = await AuthService.loginUser({ email, password });

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: loginResult,
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }
}

module.exports = AuthController;
