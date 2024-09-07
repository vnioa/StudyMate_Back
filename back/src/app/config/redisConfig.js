// Redis 클라이언트를 사용하여 서버와 연결
const redis = require("redis");

// Redis 클라이언트를 설정하고 생성
const client = redis.createClient({
    host: process.env.REDIS_HOST,   // Redis 서버의 호스트 주소
    port: process.env.REDIS_PORT,   // Redis 서버의 포트
});

// Redis 연결 오류 발생 시 콘솔에 출력
client.on("error", (err) => {
    console.error("Redis 에러: ", err);
});

// Redis 연결이 성공했을 때의 로그 메시지
client.on("connect", () => {
    console.log("Redis 서버에 연결되었습니다.");
});

// 다른 파일에서 Redis 클라이언트를 사용할 수 있도록 내보내기
module.exports = client;