const jwt = require("jsonwebtoken");

// 1. Kiểm tra xem User đã đăng nhập chưa (Validate JWT)
const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Không tìm thấy token, từ chối truy cập!",
      });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req.user sẽ chứa { userId, role } từ token
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

// 2. Kiểm tra quyền Admin (Phải chạy sau middleware authenticate)
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        success: false,
        message:
          "Cấm truy cập! Chỉ Admin mới có quyền thực hiện hành động này.",
      });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
