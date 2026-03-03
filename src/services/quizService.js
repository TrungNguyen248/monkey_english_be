const QuizRepository = require("../repositories/quizRepository");
const LessonRepository = require("../repositories/lessonRepository");
const UserRepository = require("../repositories/userRepository");
const UserProgressRepository = require("../repositories/userProgressRepository");

class QuizService {
  static async createQuiz(data) {
    const { lesson_id, title, passing_score, points_reward } = data;

    if (!lesson_id || !title) {
      throw new Error("Vui lòng cung cấp lesson_id và title!");
    }

    const lesson = await LessonRepository.getLessonById(lesson_id);
    if (!lesson) {
      throw new Error("Bài học không tồn tại!");
    }

    return await QuizRepository.createQuiz(
      lesson_id,
      title,
      passing_score || 0,
      points_reward || 0,
    );
  }

  static async getQuizzesByLessonId(lessonId) {
    return await QuizRepository.getQuizzesByLessonId(lessonId);
  }

  // Lấy chi tiết Quiz và xử lý ẩn đáp án nếu là User
  static async getFullQuizDetails(quizId, userRole) {
    const fullQuiz = await QuizRepository.getFullQuizDetails(quizId);

    if (!fullQuiz) {
      throw new Error("Không tìm thấy bài tập!");
    }

    // BẢO MẬT: Nếu không phải admin, xóa trường 'is_correct' khỏi tất cả các đáp án
    if (userRole !== "admin") {
      fullQuiz.questions.forEach((question) => {
        question.answers.forEach((answer) => {
          delete answer.is_correct;
        });
      });
    }

    return fullQuiz;
  }

  static async updateQuiz(id, data) {
    const existingQuiz = await QuizRepository.getQuizById(id);
    if (!existingQuiz) throw new Error("Không tìm thấy bài tập để cập nhật!");

    const { title, passing_score, points_reward } = data;

    return await QuizRepository.updateQuiz(
      id,
      title || existingQuiz.title,
      passing_score !== undefined ? passing_score : existingQuiz.passing_score,
      points_reward !== undefined ? points_reward : existingQuiz.points_reward,
    );
  }

  static async deleteQuiz(id) {
    const existingQuiz = await QuizRepository.getQuizById(id);
    if (!existingQuiz) throw new Error("Không tìm thấy bài tập để xóa!");

    return await QuizRepository.deleteQuiz(id);
  }

  static async submitQuiz(userId, quizId, userAnswers) {
    // 1. Lấy thông tin bài Quiz
    const quiz = await QuizRepository.getQuizById(quizId);
    if (!quiz) throw new Error("Bài tập không tồn tại!");

    // 2. Lấy danh sách đáp án ĐÚNG từ database
    const correctAnswers = await QuizRepository.getCorrectAnswers(quizId);

    // 3. Chấm điểm
    let score = 0;
    userAnswers.forEach((userAns) => {
      const isCorrect = correctAnswers.some(
        (ca) =>
          ca.question_id === userAns.question_id &&
          ca.answer_id === userAns.answer_id,
      );
      if (isCorrect) score += 1;
    });

    // 4. Kiểm tra xem User có Pass hay không
    const isPassed = score >= quiz.passing_score;

    // 5. CHỐNG CHEAT: Kiểm tra xem user đã từng pass bài này trước đây chưa
    const hasPassedBefore = await QuizRepository.hasUserPassedQuiz(
      userId,
      quizId,
    );
    const isFirstTimePass = isPassed && !hasPassedBefore;

    // 6. Lưu lịch sử làm bài vào database (Luôn lưu lại mọi lần nộp bài dù pass hay fail)
    const resultRecord = await QuizRepository.saveQuizResult(
      userId,
      quizId,
      score,
      isPassed,
    );

    // 7. Cộng điểm và tính Level CHỈ KHI Đậu LẦN ĐẦU TIÊN
    let updatedUserStats = null;
    let updatedCourseProgress = null;
    let pointsEarnedThisTime = 0;

    if (isFirstTimePass && quiz.points_reward > 0) {
      pointsEarnedThisTime = quiz.points_reward;

      // 7.1. Cập nhật điểm TỔNG cho user (Dùng cho Leaderboard)
      updatedUserStats = await UserRepository.addPointsAndLevelUp(
        userId,
        pointsEarnedThisTime,
      );

      // 7.2. Lấy thông tin Lesson để biết bài Quiz này thuộc Course nào
      const lesson = await LessonRepository.getLessonById(quiz.lesson_id);

      // 7.3. Cập nhật earned_points RIÊNG cho khóa học đó
      if (lesson && lesson.course_id) {
        updatedCourseProgress =
          await UserProgressRepository.addCourseEarnedPoints(
            userId,
            lesson.course_id,
            pointsEarnedThisTime,
          );
      }
    }

    // 8. Trả về kết quả tổng hợp cho Frontend
    return {
      score,
      total_questions: correctAnswers.length,
      is_passed: isPassed,
      is_first_time_pass: isFirstTimePass,
      points_earned: pointsEarnedThisTime,
      result_record: resultRecord,
      new_user_stats: updatedUserStats,
      course_progress: updatedCourseProgress,
    };
  }
}

module.exports = QuizService;
