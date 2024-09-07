// 업데이트 정보를 관리하는 서비스 불러오기
const updateService = require("../../app/services/updateService");

// 사용자가 새로운 업데이트를 확인하는 함수
const checkForUpdates = async (req, res) => {
    try{
        // 최신 업데이트 정보를 서비스에서 가져오기
        const updateInfo = await updateService.getLatestUpdateInfo();

        // 업데이트 정보가 있을 경우 클라이언트에 응답
        res.status(200).json({success: true, data: updateInfo});
    }catch(error){
        // 오류가 발생한 경우 에러 메시지 반환
        res.status(500).json({success: false, message: "업데이트 확인 실패", error});
    }
};

// 업데이트 알림 함수를 모듈로 내보내기
module.exports = {checkForUpdates};