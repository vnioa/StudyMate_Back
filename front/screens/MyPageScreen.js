import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, Image, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const MyPageScreen = () => {
    // 개인 정보 상태
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    // 알림, 테마, 언어 설정 상태
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState('Korean');

    // 저장소 및 활동 기록
    const [totalStorage, setTotalStorage] = useState(100);
    const [usedStorage, setUsedStorage] = useState(50); // 임시 데이터
    const [activityLog, setActivityLog] = useState([]);
    const [learningStats, setLearningStats] = useState({});

    // 보안 설정 상태
    const [password, setPassword] = useState('');
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

    // 데이터 불러오기
    useEffect(() => {
        fetchUserData();
        fetchActivityLog();
        fetchLearningStats();
    }, []);

    // 사용자 정보 불러오기
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user`);
            setName(response.data.name);
            setEmail(response.data.email);
            setPhoneNumber(response.data.phoneNumber);
            setProfileImage(response.data.profileImage);
        } catch (error) {
            console.error('사용자 정보를 불러오는 중 오류 발생:', error);
        }
    };

    // 활동 기록 불러오기
    const fetchActivityLog = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/activity-log`);
            setActivityLog(response.data);
        } catch (error) {
            console.error('활동 로그를 불러오는 중 오류 발생:', error);
        }
    };

    // 학습 통계 불러오기
    const fetchLearningStats = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/learning-stats`);
            setLearningStats(response.data);
        } catch (error) {
            console.error('학습 통계를 불러오는 중 오류 발생:', error);
        }
    };

    // 사용자 정보 업데이트
    const updateUserData = async () => {
        try {
            const response = await axios.put(`${process.env.API_URL}/user`, { name, email, phoneNumber });
            if (response.status === 200) {
                Alert.alert('성공', '사용자 정보가 업데이트되었습니다.');
            }
        } catch (error) {
            console.error('사용자 정보를 업데이트하는 중 오류 발생:', error);
            Alert.alert('오류', '사용자 정보 업데이트에 실패했습니다.');
        }
    };

    // 비밀번호 변경
    const changePassword = async () => {
        try {
            const response = await axios.put(`${process.env.API_URL}/change-password`, { password });
            if (response.status === 200) {
                Alert.alert('성공', '비밀번호가 변경되었습니다.');
            }
        } catch (error) {
            console.error('비밀번호 변경 중 오류 발생:', error);
            Alert.alert('오류', '비밀번호 변경에 실패했습니다.');
        }
    };

    // 프로필 이미지 변경
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.uri);
        }
    };

    // 프로필 이미지 업로드
    const uploadProfileImage = async () => {
        if (!profileImage) {
            Alert.alert('오류', '프로필 이미지를 선택하세요.');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', {
            uri: profileImage,
            name: 'profile.jpg',
            type: 'image/jpeg',
        });

        try {
            const response = await axios.post(`${process.env.API_URL}/upload-profile-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                Alert.alert('성공', '프로필 이미지가 업데이트되었습니다.');
            }
        } catch (error) {
            console.error('프로필 이미지 업로드 중 오류 발생:', error);
            Alert.alert('오류', '프로필 이미지 업로드에 실패했습니다.');
        }
    };

    // UI 디자인
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>마이페이지</Text>

            {/* 프로필 이미지 */}
            <View style={styles.profileSection}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                <TouchableOpacity onPress={pickImage}>
                    <Text style={styles.changeImageText}>프로필 이미지 변경</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={uploadProfileImage}>
                    <Text style={styles.uploadButton}>업로드</Text>
                </TouchableOpacity>
            </View>

            {/* 개인 정보 수정 */}
            <View style={styles.inputSection}>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="이름" />
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="이메일" keyboardType="email-address" />
                <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="전화번호" keyboardType="phone-pad" />
                <TouchableOpacity style={styles.saveButton} onPress={updateUserData}>
                    <Text style={styles.saveButtonText}>정보 저장</Text>
                </TouchableOpacity>
            </View>

            {/* 알림 설정 */}
            <View style={styles.switchSection}>
                <Text>알림 설정</Text>
                <Switch value={notifications} onValueChange={(value) => setNotifications(value)} />
            </View>

            {/* 테마 설정 */}
            <View style={styles.switchSection}>
                <Text>다크 모드</Text>
                <Switch value={darkMode} onValueChange={(value) => setDarkMode(value)} />
            </View>

            {/* 언어 설정 */}
            <View style={styles.switchSection}>
                <Text>언어 설정: {language}</Text>
                <TouchableOpacity onPress={() => setLanguage(language === 'Korean' ? 'English' : 'Korean')}>
                    <Text style={styles.changeLanguageText}>{language === 'Korean' ? 'English' : '한국어'}</Text>
                </TouchableOpacity>
            </View>

            {/* 활동 기록 */}
            <View style={styles.logSection}>
                <Text style={styles.sectionTitle}>활동 기록</Text>
                {activityLog.length > 0 ? (
                    activityLog.map((log, index) => (
                        <Text key={index}>{log}</Text>
                    ))
                ) : (
                    <Text>활동 기록이 없습니다.</Text>
                )}
            </View>

            {/* 학습 통계 */}
            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>학습 통계</Text>
                <Text>목표 달성률: {learningStats.progress}%</Text>
                <Text>학습 시간: {learningStats.totalHours}시간</Text>
            </View>

            {/* 비밀번호 변경 */}
            <View style={styles.inputSection}>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="새 비밀번호"
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.saveButton} onPress={changePassword}>
                    <Text style={styles.saveButtonText}>비밀번호 변경</Text>
                </TouchableOpacity>
            </View>

            {/* 회원 탈퇴 */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => { /* 회원 탈퇴 로직 추가 */ }}>
                <Text style={styles.deleteButtonText}>회원 탈퇴</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    changeImageText: {
        color: '#007BFF',
        marginTop: 10,
    },
    inputSection: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    switchSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logSection: {
        marginBottom: 20,
    },
    statsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default MyPageScreen;
