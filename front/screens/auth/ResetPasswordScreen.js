import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

// 비밀번호 재설정 페이지 컴포넌트
const ResetPasswordScreen = ({ navigation }) => {
    // 변수 선언
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // 비밀번호 재설정 요청 함수
    const handleResetPassword = async () => {
        if (!username || !email || !verificationCode || !newPassword) {
            Alert.alert('모든 필드를 올바르게 입력해 주세요.');
            return;
        }

        try {
            const response = await axios.post('http://121.127.165.43:3000/api/users/reset-password', {
                username,
                email,
                code: verificationCode,
                newPassword,
            });

            if (response.data.success) {
                Alert.alert('비밀번호가 성공적으로 재설정되었습니다.');
                navigation.navigate('LoginScreen'); // 비밀번호 재설정 후 로그인 화면으로 이동
            } else {
                Alert.alert(response.data.message || '비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('비밀번호 재설정 오류:', error); // 오류 로그 추가
            Alert.alert('비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>비밀번호 재설정</Text>
            <TextInput
                style={styles.input}
                placeholder="아이디"
                value={username}
                onChangeText={setUsername} // setUsername 함수로 값 변경
            />
            <TextInput
                style={styles.input}
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="인증 코드"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="새 비밀번호"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
                <Text style={styles.buttonText}>비밀번호 재설정</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f4f6f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 44,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#0057D9',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ResetPasswordScreen;
