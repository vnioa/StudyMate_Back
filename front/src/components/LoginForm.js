import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import InputField from './InputField';

function LoginForm() {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    const isLoggedIn = await loginRequest(formData.userId, formData.password);

    if (isLoggedIn) {
      alert('로그인 성공');
    } else {
      alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  const loginRequest = async (userId, password) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const isLoggedIn = userId === 'testuser' && password === 'password123';
          resolve(isLoggedIn);
        }, 1000);
      });
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form>
        <InputField
          type="text"
          name="userId"
          placeholder="아이디"
          value={formData.userId}
          onChange={handleChange}
          autocomplete="username"
        />

        <InputField
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          autocomplete="current-password"
        />

        <div>
          <button 
            type="button" 
            onClick={handleLogin}
            style={{
              backgroundColor: formData.userId && formData.password ? 'blue' : 'lightgray'
            }}
            disabled={!formData.userId || !formData.password}
          >
            로그인
          </button>
        </div>

        <div>
          <button 
            type="button" 
            onClick={() => navigate('/signup')}  // 회원가입 페이지로 이동
            style={{ marginTop: '10px' }}
          >
            회원가입
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default LoginForm;
