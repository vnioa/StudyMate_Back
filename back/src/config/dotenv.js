// dotenv 라이브러리를 사용하여 환경 변수 로드
const dotenv = require("dotenv");

// .env 파일에 있는 환경 변수를 설정하는 함수
const loadEnvVariables = () => {
    // dotenv.config()를 호출하여 .env 파일의 내용을 process.env에 로드
    const result = dotenv.config();

    // 파일이 없거나 읽을 수 없는 경우 오류 메시지 출력
    if(result.error){
        console.error(".env 파일을 로드하는 중 오류 발생: ", result.error);
    }else{
        console.log("환경 변수 로드 성공");
    }
};

// 다른 파일에서 이 함수를 사용할 수 있도록 내보내기
module.exports = loadEnvVariables;