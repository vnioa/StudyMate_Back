// responseHandler.js

// 성공 응답을 처리하는 함수입니다.
exports.sendSuccess = (res, data, message = '요청이 성공적으로 처리되었습니다.') => {
    res.status(200).json({ success: true, message, data }); // 성공 메시지와 데이터를 응답
};

// 오류 응답을 처리하는 함수입니다.
exports.sendError = (res, error, statusCode = 500) => {
    console.error('응답 오류:', error); // 오류를 콘솔에 출력
    res.status(statusCode).json({ success: false, error: error.message || '오류가 발생했습니다.' });
};
