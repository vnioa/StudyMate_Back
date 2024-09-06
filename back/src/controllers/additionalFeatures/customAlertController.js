// 사용자 맞춤 알림을 관리하는 서비스 불러오기
const alertService = require("../../services/alertService");

// 사용자 맞춤형 알림을 설정하는 함수
const setCustomAlert = async(req, res) => {
    try{
        const userId = req.user.id; // 로그인한 사용자의 ID 가져오기
        const {alertType, alertTime} = req.body; // 요청에서 알림 설정 정보를 가져오기

        // 맞춤 알림 설정 요청을 서비스에 전달
        const alertResult = await alertService.setUserAlert(userId, alertType, alertTime);

        // 설정 결과를 클라이언트에 응답
        res.status(200).json({success: true, message: "사용자 맞춤형 알림 설정 성공", data: alertResult});
    }catch(error){
        // 오류가 발생한 경우 에러 메시지 반환
        res.status(500).json({success: false, message: "사용자 맞춤형 알림 설정 실패", error});
    }
};

// 사용자 맞춤 알림 함수를 모듈로 내보내기
module.exports = {setCustomAlert};