// controllers/dashboardController.js
const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id; // authMiddleware에서 설정된 사용자 ID

        // 사용자 정보 조회
        const [userRows] = await db.execute('SELECT name FROM users WHERE id = ?', [userId]);
        const userName = userRows[0].name;

        // 오늘의 학습 시간 조회
        const [todayStudyRows] = await db.execute(
            'SELECT COALESCE(SUM(duration), 0) as todayTimeSpent FROM learning_sessions WHERE user_id = ? AND DATE(start_time) = CURDATE()',
            [userId]
        );
        const todayTimeSpent = todayStudyRows[0].todayTimeSpent / 3600; // 초를 시간으로 변환

        // 주간 목표 진행률 조회
        const [weeklyGoalRows] = await db.execute(
            'SELECT COALESCE(SUM(duration) / (SELECT weekly_goal * 3600 FROM user_goals WHERE user_id = ?), 0) as weeklyGoalProgress FROM learning_sessions WHERE user_id = ? AND start_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)',
            [userId, userId]
        );
        const weeklyGoalProgress = Math.min(weeklyGoalRows[0].weeklyGoalProgress, 1);

        // 예정된 일정 조회
        const [upcomingScheduleRows] = await db.execute(
            'SELECT title, start_time FROM schedules WHERE user_id = ? AND start_time > NOW() ORDER BY start_time ASC LIMIT 3',
            [userId]
        );
        const upcomingSchedule = upcomingScheduleRows.map(row => ({
            task: row.title,
            time: row.start_time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }));

        res.status(200).json({
            userName,
            todayTimeSpent,
            todayProgress: Math.min(todayTimeSpent / 8, 1), // 8시간을 하루 목표로 가정
            weeklyGoalProgress,
            upcomingSchedule
        });
    } catch (error) {
        console.error('대시보드 데이터 조회 오류:', error);
        res.status(500).json({ success: false, message: '대시보드 데이터 조회에 실패했습니다.' });
    }
};