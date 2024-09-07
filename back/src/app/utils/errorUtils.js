// errorUtils.js

// 사용자 정의 오류 클래스입니다.
// 예상 가능한 오류(Operational Error)와 시스템 오류를 구분하기 위해 사용됩니다.
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message); // 기본 Error 클래스의 message 설정
        this.statusCode = statusCode; // HTTP 상태 코드
        this.isOperational = isOperational; // 이 오류가 예상 가능한 오류인지 여부를 나타냄

        // Error.captureStackTrace를 통해 오류 스택 추적을 캡처
        Error.captureStackTrace(this, this.constructor);
    }
}

// 오류 핸들러 함수입니다. 발생한 오류를 로그로 남기고, 사용자에게 적절한 응답을 보냅니다.
exports.handleError = (err, res) => {
    // 오류가 예상 가능한 오류인 경우
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: 'fail',
            message: err.message,
        });
    } else {
        // 시스템 오류인 경우 (예상치 못한 오류)
        console.error('시스템 오류:', err); // 콘솔에 전체 오류 로그
        res.status(500).json({
            status: 'error',
            message: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        });
    }
};

// 사용자 정의 오류를 생성하는 함수입니다.
// 이 함수는 특정 오류 상황에 맞는 오류 메시지를 설정할 수 있도록 돕습니다.
exports.createOperationalError = (message, statusCode = 400) => {
    return new AppError(message, statusCode, true);
};

// 예상하지 못한 오류를 생성하는 함수입니다.
// 시스템 오류 등으로 인해 발생하는 예상하지 못한 오류를 생성합니다.
exports.createSystemError = (message, statusCode = 500) => {
    return new AppError(message, statusCode, false);
};

