const bcrypt = require("bcryptjs");
const db = require("./src/configs/db");

async function createAdmin() {
  try {
    const username = "admin";
    const email = "admin@gmail.com";
    const plainPassword = "123qwe";

    // 1. Hash mật khẩu bằng bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // 2. Insert vào Database
    const query = `
            INSERT INTO users (username, email, password_hash, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, username, email, role
        `;
    const { rows } = await db.query(query, [
      username,
      email,
      hashedPassword,
      "admin",
    ]);

    console.log("✅ Tạo tài khoản Admin thành công:", rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi tạo Admin:", error);
    process.exit(1);
  }
}

createAdmin();
