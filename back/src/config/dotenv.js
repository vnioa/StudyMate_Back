// dotenv 라이브러리를 사용하여 환경 변수 로드
const dotenv = require('dotenv');
const path = require('path');

// .env 파일에 있는 환경 변수를 설정하는 함수
const loadEnvVariables = () => {
    // 프로젝트 루트 디렉토리에서 .env 파일을 로드
    const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });

    if (result.error) {
        console.error('.env 파일을 로드하는 중 오류 발생:', result.error);
        process.exit(1); // 오류 발생 시 프로세스를 종료
    } else {
        console.log('환경 변수 로드 성공');
    }
};

// 다른 파일에서 이 함수를 사용할 수 있도록 내보내기
module.exports = loadEnvVariables;