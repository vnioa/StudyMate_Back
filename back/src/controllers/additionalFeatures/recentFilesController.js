// 최근 파일 보기 컨트롤러
const pool = require("../../config/db");
const {validationResult} = require("express-validator");
const logger = require("../../utils/logger");

// 최근 파일 조회
exports.getRecentFiles = async(req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const userId = req.user.id;
        const [rows] = await pool.query(
            "SELECT * FROM files WHERE user_id = ? ORDER BY uploaded_at DESC LIMIT 10",
            [userId]
        );

        if(!rows.length){
            return res.status(404).json({message: "최근 파일이 없습니다."});
        }

        res.status(200).json(rows);
    }catch(error){
        logger.error(`최근 파일 조회 중 오류 발생: ${error.message}`, error);
        res.status(500).json({message: "최근 파일을 가져오는 중 오류가 발생했습니다: ", error});
    }
};