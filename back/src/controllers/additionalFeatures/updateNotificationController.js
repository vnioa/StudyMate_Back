// 앱 업데이트 알림 컨트롤러
const pool = require("../../config/db");
const {validationResult} = require("express-validator");
const logger = require("../../utils/logger");

// 업데이트 알림 전송
exports.sendUpdateNotification = async (req, res) => {
    const{version, message} = req.body;
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        await pool.query(
            'INSERT INTO notifications (type, message, created_at) VALUES (?, ?, NOW())',
            ['update', `새로운 버전 ${version}: ${message}`]
        );
        res.status(200).json({message: "업데이트 알림 전송 성공"});
    }catch(error){
        logger.error(`업데이트 알림 전송 중 오류 발생: ${error.message}`, error);
        res.status(500).json({message: "업데이트 알림 전송 중 오류 발생", error});
    }
}