// 멀티 디바이스 동기화 컨트롤러
const pool = require("../../config/db");
const {validationResult} = require("express-validator");
const logger = require("../../utils/logger");

// 사용자 데이터 동기화
exports.syncData = async(req, res) => {
    const {data} = req.body;
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        await pool.query("UPDATE users SET sync_data = ? WHERE id = ?", [JSON.stringify(data), req.user.id]);
        res.status(200).json({message: "데이터 동기화 성공"});
    }catch(error){
        logger.error(`데이터 동기화 중 오류 발생: ${error.message}`, error);
        res.status(500).json({message: "데이터 동기화 중 오류 발생: ", error});
    }
};