// controllers/goalController.js
const db = require('../config/db');

exports.getGoals = async (req, res) => {
    const userId = req.user.id;
    try {
        const [goals] = await db.execute(
            'SELECT * FROM user_goals WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.status(200).json({ success: true, goals });
    } catch (error) {
        console.error('목표 조회 오류:', error);
        res.status(500).json({ success: false, message: '목표 조회에 실패했습니다.' });
    }
};

exports.createGoal = async (req, res) => {
    const { title, description, deadline, priority } = req.body;
    const userId = req.user.id;
    try {
        const [result] = await db.execute(
            'INSERT INTO user_goals (user_id, title, description, deadline, priority) VALUES (?, ?, ?, ?, ?)',
            [userId, title, description, deadline, priority]
        );
        res.status(201).json({ success: true, message: '목표가 생성되었습니다.', goalId: result.insertId });
    } catch (error) {
        console.error('목표 생성 오류:', error);
        res.status(500).json({ success: false, message: '목표 생성에 실패했습니다.' });
    }
};

exports.updateGoal = async (req, res) => {
    const { goalId, title, description, deadline, priority } = req.body;
    const userId = req.user.id;
    try {
        await db.execute(
            'UPDATE user_goals SET title = ?, description = ?, deadline = ?, priority = ? WHERE id = ? AND user_id = ?',
            [title, description, deadline, priority, goalId, userId]
        );
        res.status(200).json({ success: true, message: '목표가 업데이트되었습니다.' });
    } catch (error) {
        console.error('목표 업데이트 오류:', error);
        res.status(500).json({ success: false, message: '목표 업데이트에 실패했습니다.' });
    }
};

exports.deleteGoal = async (req, res) => {
    const { goalId } = req.params;
    const userId = req.user.id;
    try {
        await db.execute('DELETE FROM user_goals WHERE id = ? AND user_id = ?', [goalId, userId]);
        res.status(200).json({ success: true, message: '목표가 삭제되었습니다.' });
    } catch (error) {
        console.error('목표 삭제 오류:', error);
        res.status(500).json({ success: false, message: '목표 삭제에 실패했습니다.' });
    }
};