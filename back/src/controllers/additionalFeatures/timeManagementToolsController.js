// 시간 관리 도구를 관리하는 서비스 불러오기
const timeManagementService = require("../../services/timeManagementService");

// 공부 타이머를 시작하는 함수
const startStudyTimer = async(req, res) => {
    try{
        const userId = req.user.id; // 로그인한 사용자의 ID를 가져오기

        // 타이머 시작 요청을 서비스에 전달
        const timerData = await timeManagementService.startTimer(userId);

        // 타이머 시작 정보를 클라이언트에 응답
        res.status(200).json({success: true, data: timerData});
    }catch(error){
        // 오류가 발생한 경우 에러 메시지 반환
        res.status(500).json({success: false, message: "타이머 시작 실패", error});
    }
};

// 타이머 관련 함수를 모듈로 내보내기
module.exports = {startStudyTimer};