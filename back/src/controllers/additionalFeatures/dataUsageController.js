// 데이터 사용량을 관리하는 서비스 불러오기
const dataUsageService = require("../../app/services/dataUsageService");

// 사용자의 데이터 사용량을 확인하는 함수
const getDataUsage = async(req, res) => {
    try{
        const userId = req.user.id; // 로그인한 사용자의 ID 가져오기

        // 데이터 사용량 정보를 서비스에서 가져오기
        const usageData = await dataUsageService.getUserDataUsage(userId);

        // 데이터 사용량 정보를 클라이언트에 응답
        res.status(200).json({success: true, data: usageData});
    }catch(error){
        // 오류가 발생한 경우 에러 메시지 반환
        res.status(500).json({success: false, message: "데이터 사용량 불러오기 실패", error});
    }
};

// 데이터 사용량 확인 함수를 모듈로 내보내기
module.exports = {getDataUsage};