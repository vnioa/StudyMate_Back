// 특정 날짜를 YYYY-MM-DD 형식으로 변환하는 함수입니다.
exports.formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 맞춤
    const day = String(d.getDate()).padStart(2, '0'); // 일을 2자리로 맞춤
    return `${year}-${month}-${day}`; // 변환된 날짜를 반환
};

// 현재 날짜와 시간을 반환하는 함수입니다.
exports.getCurrentDateTime = () => {
    return new Date().toISOString(); // ISO 형식으로 현재 시간을 반환
};
