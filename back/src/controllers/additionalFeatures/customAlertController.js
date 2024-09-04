// customAlertController.js - 사용자 맞춤 알림 설정 컨트롤러
const pool = require('../../config/db');
const { validationResult } = require('express-validator');
const logger = require('../../utils/logger');

// 알림 설정 조회
exports.getAlertSettings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT alert_settings FROM users WHERE id = ?', [req.user.id]);
        if (!rows.length) {
            return res.status(404).json({ message: '알림 설정을 찾을 수 없습니다.' });
        }
        res.status(200).json({ alertSettings: JSON.parse(rows[0].alert_settings) });
    } catch (error) {
        logger.error(`알림 설정 조회 중 오류 발생: ${error.message}`, error);
        res.status(500).json({ message: '알림 설정을 가져오는 중 오류가 발생했습니다.', error });
    }
};

// 알림 설정 업데이트
exports.updateAlertSettings = async (req, res) => {
    const { settings } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        await pool.query('UPDATE users SET alert_settings = ? WHERE id = ?', [JSON.stringify(settings), req.user.id]);
        res.status(200).json({ message: '알림 설정이 성공적으로 업데이트되었습니다.' });
    } catch (error) {
        logger.error(`알림 설정 업데이트 중 오류 발생: ${error.message}`, error);
        res.status(500).json({ message: '알림 설정 업데이트 중 오류가 발생했습니다.', error });
    }
};
