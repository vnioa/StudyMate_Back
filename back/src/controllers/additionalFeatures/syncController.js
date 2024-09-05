// 사용자 데이터를 관리하는 서비스 불러오기
const syncService = require("../../services/syncService");

// 사용자의 데이터를 동기화하는 함수
const syncData = async (req, res) => {
    try{
        const userId = req.user.id; // 로그인한 사용자의 ID 가져오기

        // 동기화할 데이터와 기기 정보를 요청에서 가져오기(객체 형태로)
        const {deviceData} = req.body;

        // 데잍를 동기화 서비스에 전달하여 처리
        const result = await syncService.syncUserData(userId, deviceData);

        // 동기화 결과를 클라이언트에 응답
        res.status(200).json({success: true, message: "데이터 동기화 성공", data: result});
    }catch(error){
        // 오류가 발생한 경우 에러 메시지를 반환
        res.status(500).json({success: false, message: "데이터 동기화 실패", error});
    }
};

// 동기화 함수를 모듈로 내보내기
module.exports = {syncData};