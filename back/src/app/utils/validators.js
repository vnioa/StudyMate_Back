// validators.js

// 각 입력값에 대한 검증 로직을 포함하는 유틸리티 파일입니다.
exports.validateInputs = (inputs) => {
    const errors = [];

    // 아이디 검증
    if (!exports.validateUsername(inputs.username)) {
        errors.push('아이디는 4~20자의 영문, 숫자 조합으로 입력해야 합니다.');
    }

    // 비밀번호 검증
    if (!exports.validatePassword(inputs.password)) {
        errors.push('비밀번호는 영문, 숫자, 특수문자를 포함한 10~20자리여야 합니다.');
    }

    // 이메일 검증
    if (!exports.validateEmail(inputs.email)) {
        errors.push('유효한 이메일 형식이 아닙니다.');
    }

    return errors;
};

// 이메일 형식을 검증하는 함수입니다.
exports.validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식에 대한 정규 표현식
    return regex.test(email); // 이메일이 올바른 형식인지 검사
};

// 비밀번호 복잡성을 검증하는 함수입니다.
exports.validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,20}$/;
    return regex.test(password); // 영문, 숫자, 특수문자를 포함하는 10~20자리 비밀번호 검증
};

// 아이디 형식을 검증하는 함수입니다.
exports.validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9]{4,20}$/; // 4~20자의 영문, 숫자 조합의 아이디 형식
    return regex.test(username);
};
