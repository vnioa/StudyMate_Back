// controllers/scheduleController.js
const db = require('../config/db');

exports.getSchedules = async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    try {
        const [schedules] = await db.execute(
            'SELECT * FROM schedules WHERE user_id = ? AND start_time BETWEEN ? AND ? ORDER BY start_time ASC',
            [userId, startDate, endDate]
        );
        res.status(200).json({ success: true, schedules });
    } catch (error) {
        console.error('일정 조회 오류:', error);
        res.status(500).json({ success: false, message: '일정 조회에 실패했습니다.' });
    }
};

exports.createSchedule = async (req, res) => {
    const { title, description, startTime, endTime, isRepeating, repeatType, repeatEndDate } = req.body;
    const userId = req.user.id;
    try {
        const [result] = await db.execute(
            'INSERT INTO schedules (user_id, title, description, start_time, end_time, is_repeating, repeat_type, repeat_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, title, description, startTime, endTime, isRepeating, repeatType, repeatEndDate]
        );
        res.status(201).json({ success: true, message: '일정이 생성되었습니다.', scheduleId: result.insertId });
    } catch (error) {
        console.error('일정 생성 오류:', error);
        res.status(500).json({ success: false, message: '일정 생성에 실패했습니다.' });
    }
};

exports.updateSchedule = async (req, res) => {
    const { scheduleId, title, description, startTime, endTime, isRepeating, repeatType, repeatEndDate } = req.body;
    const userId = req.user.id;
    try {
        await db.execute(
            'UPDATE schedules SET title = ?, description = ?, start_time = ?, end_time = ?, is_repeating = ?, repeat_type = ?, repeat_end_date = ? WHERE id = ? AND user_id = ?',
            [title, description, startTime, endTime, isRepeating, repeatType, repeatEndDate, scheduleId, userId]
        );
        res.status(200).json({ success: true, message: '일정이 업데이트되었습니다.' });
    } catch (error) {
        console.error('일정 업데이트 오류:', error);
        res.status(500).json({ success: false, message: '일정 업데이트에 실패했습니다.' });
    }
};

exports.deleteSchedule = async (req, res) => {
    const { scheduleId } = req.params;
    const userId = req.user.id;
    try {
        await db.execute('DELETE FROM schedules WHERE id = ? AND user_id = ?', [scheduleId, userId]);
        res.status(200).json({ success: true, message: '일정이 삭제되었습니다.' });
    } catch (error) {
        console.error('일정 삭제 오류:', error);
        res.status(500).json({ success: false, message: '일정 삭제에 실패했습니다.' });
    }
};