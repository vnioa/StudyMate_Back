import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';

function SignUpForm() {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    birthDate: '',
    phoneNumber: '',
    email: '',
    verificationCode: '',
    generatedCode: '',
    isIdUnique: false,
    isPasswordValid: false,
    isPasswordConfirmed: false,
    isEmailVerified: false
  });

  const [buttonStates, setButtonStates] = useState({
    checkIdButton: false,
    sendCodeButton: false,
    verifyButton: false,
    signUpButton: false
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'userId' && value.length > 0) {
      setButtonStates({ ...buttonStates, checkIdButton: true });
    }

    if (name === 'password' || name === 'confirmPassword') {
      const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{10,20}$/.test(
        name === 'password' ? value : formData.password
      );

      const isPasswordConfirmed =
        name === 'password'
          ? value === formData.confirmPassword
          : formData.password === value;

        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          isPasswordValid: isPasswordValid,
          isPasswordConfirmed: isPasswordConfirmed,
        }));
      }

    if (name === 'birthDate') {
      const formattedDate = value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      setFormData({ ...formData, birthDate: formattedDate });
    }

    if (name === 'phoneNumber') {
      const formattedPhone = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      setFormData({ ...formData, phoneNumber: formattedPhone });
    }

    if (name === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setButtonStates({ ...buttonStates, sendCodeButton: true });
    }

    if (name === 'verificationCode' && value.length === 7) {
      setButtonStates({ ...buttonStates, verifyButton: true });
    }
  };

  const handleCheckId = () => {
    const isUnique = true; 
    alert("사용 가능합니다.");
    setFormData({ ...formData, isIdUnique: isUnique });
  };

  const handleSendCode = () => {
    const randomCode = Math.floor(1000000 + Math.random() * 9000000).toString();
    setFormData({ ...formData, generatedCode: randomCode });
    alert(`인증번호: ${randomCode}`);
  };

  const handleVerifyCode = () => {
    if (formData.verificationCode === formData.generatedCode) {
      setFormData({ ...formData, isEmailVerified: true });
      setButtonStates({ ...buttonStates, signUpButton: true });
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  const handleSignUp = async () => {
    if (!formData.isIdUnique || !formData.isPasswordValid || !formData.isPasswordConfirmed || !formData.isEmailVerified) {
      alert('모든 입력 사항을 올바르게 입력해 주세요.');
      return;
    }

    const isRegistered = await registerRequest(formData);

    if (isRegistered) {
      alert('회원가입이 성공적으로 완료되었습니다.');
      navigate('/'); 
    } else {
      alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const registerRequest = async (formData) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const isRegistered = formData.userId && formData.password === formData.confirmPassword;
          resolve(isRegistered);
        }, 1000);
      });
    } catch (error) {
      console.error('Error registering:', error);
      return false;
    }
  };

   const getButtonStyle = (isEnabled) => ({
    backgroundColor: isEnabled ? '#4CAF50' : '#ccc', 
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: isEnabled ? 'pointer' : 'not-allowed',
    transition: 'background-color 0.3s ease'
  });

  return (
    <div>
      <h2>회원가입</h2>
      <form>
        <InputField
          type="text"
          name="userId"
          placeholder="아이디"
          value={formData.userId}
          onChange={handleChange}
          rightElement={
            <button 
              type="button" 
              style={getButtonStyle(buttonStates.checkIdButton)} 
              onClick={handleCheckId} 
              disabled={!buttonStates.checkIdButton}
            >
              중복확인
            </button>
          }
        />

        <InputField
          type="password"
          name="password"
          placeholder="비밀번호"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />

        <InputField
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 재입력"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          rightElement={
            formData.isPasswordConfirmed ? <span>✔️</span> : <span>❌</span>
          }
        />

        <InputField
          type="text"
          name="fullName"
          placeholder="이름"
          value={formData.fullName}
          onChange={handleChange}
        />

        <InputField
          type="text"
          name="birthDate"
          placeholder="생년월일 (YYYYMMDD)"
          value={formData.birthDate}
          onChange={handleChange}
        />

        <InputField
          type="text"
          name="phoneNumber"
          placeholder="전화번호 (01012345678)"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <InputField
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          rightElement={
            <button 
              type="button" 
              style={getButtonStyle(buttonStates.sendCodeButton)} 
              onClick={handleSendCode} 
              disabled={!buttonStates.sendCodeButton}
            >
              인증번호 발송
            </button>
          }
        />

        {formData.generatedCode && (
          <InputField
            type="text"
            name="verificationCode"
            placeholder="인증번호 입력"
            value={formData.verificationCode}
            onChange={handleChange}
            rightElement={
              <button 
                type="button" 
                style={getButtonStyle(buttonStates.verifyButton)} 
                onClick={handleVerifyCode} 
                disabled={!buttonStates.verifyButton}
              >
                인증하기
              </button>
            }
          />
        )}

        <div>
          <button 
            type="button" 
            style={getButtonStyle(buttonStates.signUpButton)} 
            onClick={handleSignUp} 
            disabled={!buttonStates.signUpButton}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;