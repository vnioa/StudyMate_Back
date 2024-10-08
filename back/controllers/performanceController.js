// controllers/performanceController.js
const db = require('../config/db');

exports.getPerformanceData = async (req, res) => {
    const userId = req.user.id;
    try {
        // 학습 진도율 계산
        const [progressResult] = await db.execute(`
      SELECT 
        (SUM(duration) / (SELECT weekly_goal * 3600 FROM user_goals WHERE user_id = ?)) * 100 as progress
      FROM learning_sessions 
      WHERE user_id = ? AND start_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `, [userId, userId]);

        // 성적 추이 계산
        const [gradesResult] = await db.execute(`
      SELECT DATE(submitted_at) as date, AVG(score / total_questions * 100) as average_score
      FROM quiz_results
      WHERE user_id = ?
      GROUP BY DATE(submitted_at)
      ORDER BY date DESC
      LIMIT 10
    `, [userId]);

        // 목표 달성 현황
        const [goalsResult] = await db.execute(`
      SELECT 
        g.title, 
        g.target_value, 
        COALESCE(SUM(ls.duration) / 3600, 0) as achieved_value,
        (COALESCE(SUM(ls.duration) / 3600, 0) / g.target_value) * 100 as achievement_rate
      FROM user_goals g
      LEFT JOIN learning_sessions ls ON g.id = ls.goal_id AND ls.user_id = ?
      WHERE g.user_id = ? AND g.deadline >= CURDATE()
      GROUP BY g.id
    `, [userId, userId]);

        // 학습 시간 vs 성과 분석
        const [timeVsPerformanceResult] = await db.execute(`
      SELECT 
        DATE(ls.start_time) as date,
        SUM(ls.duration) / 3600 as study_hours,
        AVG(qr.score / qr.total_questions * 100) as average_score
      FROM learning_sessions ls
      LEFT JOIN quiz_results qr ON DATE(ls.start_time) = DATE(qr.submitted_at) AND ls.user_id = qr.user_id
      WHERE ls.user_id = ?
      GROUP BY DATE(ls.start_time)
      ORDER BY date DESC
      LIMIT 30
    `, [userId]);

        res.status(200).json({
            success: true,
            data: {
                progress: progressResult[0].progress,
                grades: gradesResult,
                goals: goalsResult,
                timeVsPerformance: timeVsPerformanceResult
            }
        });
    } catch (error) {
        console.error('성과 데이터 조회 오류:', error);
        res.status(500).json({ success: false, message: '성과 데이터 조회에 실패했습니다.' });
    }
};