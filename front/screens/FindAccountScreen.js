import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';

const FindAccountScreen = ({ navigation }) => {
  const [mode, setMode] = useState('아이디 찾기'); // 모드 전환 상태
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');

  const handleSendVerificationCode = async () => {
    try {
      const response = await fetch('https://yourserver.com/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setSentCode(data.code);
        Alert.alert('인증번호 발송', '이메일로 인증번호가 발송되었습니다.');
      } else {
        Alert.alert('오류', '인증번호 발송에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '인증번호 발송 중 문제가 발생했습니다.');
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode === sentCode) {
      if (mode === '아이디 찾기') {
        Alert.alert('아이디 찾기', `아이디는 example123입니다.`);
      } else {
        navigation.navigate('ResetPasswordScreen');
      }
    } else {
      Alert.alert('오류', '인증번호가 일치하지 않습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{mode}</Text>
      <View style={styles.modeSwitchContainer}>
        <TouchableOpacity
          style={[styles.modeButton, mode === '아이디 찾기' && styles.activeModeButton]}
          onPress={() => setMode('아이디 찾기')}
        >
          <Text style={styles.modeButtonText}>아이디 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === '비밀번호 찾기' && styles.activeModeButton]}
          onPress={() => setMode('비밀번호 찾기')}
        >
          <Text style={styles.modeButtonText}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>

      {mode === '아이디 찾기' ? (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력하세요"
            keyboardType="email-address"
          />
          <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={handleSendVerificationCode}>
            <Text style={styles.buttonText}>인증번호 발송</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>아이디</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="아이디를 입력하세요"
          />
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력하세요"
            keyboardType="email-address"
          />
          <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={handleSendVerificationCode}>
            <Text style={styles.buttonText}>인증번호 발송</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>인증번호</Text>
        <TextInput
          style={styles.input}
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder="인증번호를 입력하세요"
          keyboardType="numeric"
        />
        <TouchableOpacity style={[styles.button, styles.verifyButton]} onPress={handleVerifyCode}>
          <Text style={styles.buttonText}>인증하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modeSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
  },
  activeModeButton: {
    backgroundColor: '#007bff',
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#28a745',
  },
  verifyButton: {
    backgroundColor: '#17a2b8',
  },
});

export default FindAccountScreen;
