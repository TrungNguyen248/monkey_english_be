const calculateLevel = (totalPoints) => {
  // Cách 1: Sử dụng các mốc điểm cố định (Khuyên dùng cho hệ thống nhỏ)
  /*
    if (totalPoints < 100) return 1;
    if (totalPoints < 300) return 2;
    if (totalPoints < 600) return 3;
    if (totalPoints < 1000) return 4;
    if (totalPoints < 1500) return 5;
    return 6; 
    */

  // Cách 2: Sử dụng công thức toán học
  // Ví dụ: Mỗi level cần số điểm ngày càng tăng. Level = căn bậc 2 của (Điểm / 50) + 1
  // Điểm: 0->Lv1, 50->Lv2, 200->Lv3, 450->Lv4, 800->Lv5, 1250->Lv6...

  if (!totalPoints || totalPoints < 0) return 1;

  const calculatedLevel = Math.floor(Math.sqrt(totalPoints / 50)) + 1;
  return calculatedLevel;
};

module.exports = {
  calculateLevel,
};
