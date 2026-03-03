const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/userRepository");

class AuthService {
  static async registerUser({ username, email, password }) {
    // 1. Kiểm tra xem email hoặc username đã tồn tại chưa
    const existingEmail = await UserRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error("Email này đã được sử dụng!");
    }

    const existingUsername = await UserRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error("Tên đăng nhập này đã tồn tại!");
    }

    // 2. Băm mật khẩu (Hash password)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Lưu vào database thông qua Repository
    const newUser = await UserRepository.createUser(
      username,
      email,
      passwordHash,
    );

    return newUser;
  }

  static async loginUser({ email, password }) {
    // 1. Tìm user bằng email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email không tồn tại trong hệ thống!");
    }

    // 2. So sánh mật khẩu
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Mật khẩu không chính xác!");
    }

    // 3. Tạo JWT Token (Chứa id và role)
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // Token sống 1 ngày
    );

    // 4. Trả về token và thông tin user (loại bỏ password_hash)
    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      total_points: user.total_points,
      current_level: user.current_level,
    };

    return { token, user: userProfile };
  }
}

module.exports = AuthService;
