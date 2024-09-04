// timeManagementToolsController.js - 시간 관리 도구 컨트롤러
const pool = require('../../config/db');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

// 타이머 설정
exports.setTimer = (req, res) => {
    const { duration } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // 타이머 설정 로직 추가 필요
    res.status(200).json({ message: `타이머가 ${duration}분으로 설정되었습니다.` });
};

// 사용 시간 추적
exports.trackTime = async (req, res) => {
    const { timeSpent } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        await pool.query('UPDATE users SET time_spent = time_spent + ? WHERE id = ?', [timeSpent, req.user.id]);
        res.status(200).json({ message: '시간 기록 성공' });
    } catch (error) {
        logger.error(`시간 기록 중 오류 발생: ${error.message}`, error);
        res.status(500).json({ message: '시간 기록 중 오류 발생.', error });
    }
};
