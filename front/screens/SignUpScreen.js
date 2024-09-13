import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [sentCode, setSentCode] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleCheckUsername = async () => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/check-username`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (data.isAvailable) {
                Alert.alert('아이디 중복 확인', '아이디가 사용 가능합니다.');
            } else {
                Alert.alert('아이디 중복 확인', '아이디가 이미 사용 중입니다.');
            }
        } catch (error) {
            Alert.alert('오류', '아이디 중복 확인 중 오류가 발생했습니다.');
        }
    };

    const handleSendVerificationCode = async () => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/send-verification`, {
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
            setIsVerified(true);
            Alert.alert('인증 완료', '이메일 인증이 완료되었습니다.');
        } else {
            Alert.alert('오류', '인증번호가 일치하지 않습니다.');
        }
    };

    const handleSignUp = async () => {
        if (!isVerified) {
            Alert.alert('오류', '이메일 인증을 완료해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch(`${process.env.API_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, name, birthDate: birthDate.toISOString().split('T')[0], phone, email }),
            });
            const data = await response.json();
            if (data.success) {
                Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
                navigation.navigate('LoginScreen');
            } else {
                Alert.alert('오류', '회원가입에 실패했습니다.');
            }
        } catch (error) {
            Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || birthDate;
        setShowDatePicker(Platform.OS === 'ios');
        setBirthDate(currentDate);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>회원가입</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>아이디</Text>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 3 }]}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="아이디를 입력하세요"
                    />
                    <TouchableOpacity style={[styles.button, styles.checkButton]} onPress={handleCheckUsername}>
                        <Text style={styles.buttonText}>중복 확인</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="비밀번호를 입력하세요"
                    secureTextEntry
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>비밀번호 재입력</Text>
                <View style={styles.passwordConfirmContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="비밀번호를 다시 입력하세요"
                        secureTextEntry
                    />
                    {confirmPassword !== '' && (
                        <Text style={[styles.icon, password === confirmPassword ? styles.checkIcon : styles.crossIcon]}>
                            {password === confirmPassword ? '✔️' : '❌'}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>이름</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="이름을 입력하세요"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>생년월일</Text>
                <View style={styles.datePickerContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={birthDate.toISOString().split('T')[0]}
                        editable={false}
                    />
                    <TouchableOpacity style={styles.calendarButton} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.calendarButtonText}>📅</Text>
                    </TouchableOpacity>
                </View>
                {showDatePicker && (
                    <DateTimePicker
                        value={birthDate}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                        maximumDate={new Date()}
                    />
                )}
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>전화번호</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={(text) => setPhone(text.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'))}
                    placeholder="010-1234-5678"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>이메일</Text>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 3 }]}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="이메일을 입력하세요"
                        keyboardType="email-address"
                    />
                    <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={handleSendVerificationCode}>
                        <Text style={styles.buttonText}>인증번호 발송</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>인증번호</Text>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 3 }]}
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        placeholder="인증번호를 입력하세요"
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={[styles.button, styles.verifyButton]} onPress={handleVerifyCode}>
                        <Text style={styles.buttonText}>인증하기</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.signUpButton, !isVerified && { backgroundColor: '#ccc' }]}
                onPress={handleSignUp}
                disabled={!isVerified || password !== confirmPassword}
            >
                <Text style={styles.signUpButtonText}>회원가입</Text>
            </TouchableOpacity>
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 10,
    },
    buttonText: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    checkButton: {
        backgroundColor: '#007bff',
    },
    sendButton: {
        backgroundColor: '#28a745',
    },
    verifyButton: {
        backgroundColor: '#17a2b8',
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    calendarButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        marginLeft: 10,
    },
    calendarButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    passwordConfirmContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 10,
        fontSize: 20,
    },
    checkIcon: {
        color: 'green',
    },
    crossIcon: {
        color: 'red',
    },
    signUpButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    signUpButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
