import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const FindIdPasswordScreen = ({ navigation }) => {
    const [isIdTab, setIsIdTab] = useState(true); // 탭 전환 상태
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [receivedCode, setReceivedCode] = useState('');
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const slideAnim = new Animated.Value(0); // 애니메이션 초기 설정

    // 탭 전환 애니메이션
    const handleTabChange = (toIdTab) => {
        setIsIdTab(toIdTab);
        Animated.timing(slideAnim, {
            toValue: toIdTab ? 0 : 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    // 아이디 찾기 요청
    const handleFindId = async () => {
        if (!name || !email) {
            Alert.alert('모든 정보를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://121.127.165.43:3000/api/users/find-id', {
                name,
                email,
            });

            if (response.data.success) {
                Alert.alert(`아이디는 ${response.data.username}입니다.`);
            } else {
                Alert.alert('입력한 정보와 일치하는 아이디가 없습니다.');
            }
        } catch (error) {
            Alert.alert('아이디 찾기 요청에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 비밀번호 찾기 인증코드 요청
    const requestVerificationCode = async () => {
        if (!username || !email) {
            Alert.alert('아이디와 이메일을 모두 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://121.127.165.43:3000/api/users/send-verification-code', {
                username,
                email,
            });

            if (response.data.success) {
                setReceivedCode(response.data.code); // 서버에서 받은 인증 코드 저장
                Alert.alert('인증 코드가 발송되었습니다.');
            } else {
                Alert.alert('입력한 정보와 일치하는 계정을 찾을 수 없습니다.');
            }
        } catch (error) {
            Alert.alert('인증 코드 요청에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 인증 코드 검증
    const verifyCode = () => {
        if (verificationCode === receivedCode) {
            setIsCodeVerified(true);
            Alert.alert('인증이 완료되었습니다.');
        } else {
            Alert.alert('인증 코드가 일치하지 않습니다.');
        }
    };

    return (
        <View style={styles.container}>
            {/* 탭 전환 버튼 */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, isIdTab && styles.activeTab]}
                    onPress={() => handleTabChange(true)}
                >
                    <Text style={[styles.tabText, isIdTab && styles.activeTabText]}>아이디 찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, !isIdTab && styles.activeTab]}
                    onPress={() => handleTabChange(false)}
                >
                    <Text style={[styles.tabText, !isIdTab && styles.activeTabText]}>비밀번호 찾기</Text>
                </TouchableOpacity>
            </View>

            <Animated.View
                style={[
                    styles.formContainer,
                    {
                        transform: [
                            {
                                translateX: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -400], // 탭 전환 시 슬라이드 효과
                                }),
                            },
                        ],
                    },
                ]}
            >
                {/* 아이디 찾기 탭 */}
                {isIdTab ? (
                    <View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="이름"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="등록된 이메일"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleFindId}>
                            <Text style={styles.buttonText}>아이디 찾기</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // 비밀번호 찾기 탭
                    <View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="아이디"
                                value={username}
                                onChangeText={setUsername}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="등록된 이메일"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={requestVerificationCode}>
                            <Text style={styles.buttonText}>인증코드 발송</Text>
                        </TouchableOpacity>
                        <View style={styles.inputContainer}>
                            <Ionicons name="key-outline" size={20} color="#888" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="인증코드를 입력하세요"
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={verifyCode}>
                            <Text style={styles.buttonText}>코드 확인</Text>
                        </TouchableOpacity>

                        {/* 인증에 성공하면 비밀번호 재설정 버튼 활성화 */}
                        {isCodeVerified && (
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={() => navigation.navigate('ResetPasswordScreen')}
                            >
                                <Text style={styles.buttonText}>비밀번호 재설정</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f6f8',
        justifyContent: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
    },
    activeTab: {
        borderBottomColor: '#0057D9',
    },
    tabText: {
        fontSize: 16,
        color: '#888',
    },
    activeTabText: {
        color: '#0057D9',
        fontWeight: 'bold',
    },
    formContainer: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    inputIcon: {
        marginLeft: 10,
    },
    input: {
        flex: 1,
        height: 44,
        paddingHorizontal: 10,
        borderColor: 'transparent',
    },
    button: {
        backgroundColor: '#0057D9',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    resetButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default FindIdPasswordScreen;
