// controllers/timerController.js
const db = require('../config/db');

exports.startTimer = async (req, res) => {
    const userId = req.user.id;
    const { subject } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO learning_sessions (user_id, subject, start_time) VALUES (?, ?, NOW())',
            [userId, subject]
        );
        res.status(201).json({ success: true, sessionId: result.insertId });
    } catch (error) {
        console.error('타이머 시작 오류:', error);
        res.status(500).json({ success: false, message: '타이머 시작에 실패했습니다.' });
    }
};

exports.stopTimer = async (req, res) => {
    const userId = req.user.id;
    const { sessionId } = req.params;

    try {
        await db.execute(
            'UPDATE learning_sessions SET end_time = NOW(), duration = TIMESTAMPDIFF(SECOND, start_time, NOW()) WHERE id = ? AND user_id = ?',
            [sessionId, userId]
        );
        res.status(200).json({ success: true, message: '타이머가 정지되었습니다.' });
    } catch (error) {
        console.error('타이머 정지 오류:', error);
        res.status(500).json({ success: false, message: '타이머 정지에 실패했습니다.' });
    }
};

exports.getTimerHistory = async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    try {
        const [history] = await db.execute(
            'SELECT * FROM learning_sessions WHERE user_id = ? AND start_time BETWEEN ? AND ? ORDER BY start_time DESC',
            [userId, startDate, endDate]
        );
        res.status(200).json({ success: true, history });
    } catch (error) {
        console.error('타이머 기록 조회 오류:', error);
        res.status(500).json({ success: false, message: '타이머 기록 조회에 실패했습니다.' });
    }
};