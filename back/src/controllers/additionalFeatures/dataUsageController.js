// dataUsageController.js - 데이터 사용량 확인 컨트롤러
const pool = require('../../config/db');
const logger = require('../../utils/logger');

// 데이터 사용량 조회
exports.getDataUsage = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT data_usage FROM users WHERE id = ?', [req.user.id]);
        if (!rows.length) {
            return res.status(404).json({ message: '데이터 사용량 정보를 찾을 수 없습니다.' });
        }
        res.status(200).json({ dataUsage: rows[0].data_usage });
    } catch (error) {
        logger.error(`데이터 사용량 조회 중 오류 발생: ${error.message}`, error);
        res.status(500).json({ message: '데이터 사용량을 가져오는 중 오류가 발생했습니다.', error });
    }
};
