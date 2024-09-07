// 파일 관련 데이터를 관리하는 모델 불러오기
const fileModel = require("../../app/models/fileModel");

// 최근 파일 목록을 가져오는 함수
const getRecentFiles = async(req, res) => {
    try{
        const userId = req.user.id; // 로그인한 사용자의 ID 가져오기

        // 최근 파일 목록을 DB에서 가져오기
        const recentFiles = await fileModel.getRecentFilesByUser(userId);

        // 가져온 파일 목록을 클라이언트에 응답
        res.status(200).json({success: true, data: recentFiles});

    }catch(error){
        // 오류가 발생한 경우 에러 메시지 출력
        res.status(500).json({success: false, message: "최근 파일 불러오기 실패", error});
    }
};

// 파일 목록을 가져오는 함수를 모듈로 내보내기
module.exports = {getRecentFiles};