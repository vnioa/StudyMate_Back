import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, Slider, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const SettingsScreen = () => {
    // 상태값 선언
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [fontSize, setFontSize] = useState(14);
    const [theme, setTheme] = useState('light');
    const [backupFrequency, setBackupFrequency] = useState('weekly');
    const [backupFormats, setBackupFormats] = useState('PDF');
    const [chatHistoryRetention, setChatHistoryRetention] = useState('1_month');

    // 서버에서 설정값 가져오기
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${process.env.API_URL}/user/settings`);
                if (response.data) {
                    setNotificationsEnabled(response.data.notificationsEnabled);
                    setFontSize(response.data.fontSize);
                    setTheme(response.data.theme);
                    setBackupFrequency(response.data.backupFrequency);
                    setBackupFormats(response.data.backupFormats);
                    setChatHistoryRetention(response.data.chatHistoryRetention);
                }
            } catch (error) {
                console.error("설정을 불러오는 중 오류 발생:", error);
            }
        };
        fetchSettings();
    }, []);

    // 설정값 저장하기
    const saveSettings = async () => {
        try {
            const response = await axios.post(`${process.env.API_URL}/user/settings`, {
                notificationsEnabled,
                fontSize,
                theme,
                backupFrequency,
                backupFormats,
                chatHistoryRetention,
            });
            if (response.status === 200) {
                Alert.alert('설정 저장', '설정이 성공적으로 저장되었습니다.');
            }
        } catch (error) {
            console.error("설정 저장 중 오류 발생:", error);
            Alert.alert('설정 저장 실패', '설정을 저장할 수 없습니다.');
        }
    };

    // 로그아웃
    const handleLogout = () => {
        // 서버 연동된 로그아웃 로직 추가
        Alert.alert('로그아웃', '로그아웃 되었습니다.');
    };

    return (
        <View style={styles.container}>
            {/* 알림 설정 */}
            <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>알림 설정</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={(value) => setNotificationsEnabled(value)}
                />
            </View>

            {/* 폰트 크기 설정 */}
            <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>폰트 크기</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={10}
                    maximumValue={30}
                    value={fontSize}
                    onValueChange={(value) => setFontSize(value)}
                />
                <Text style={styles.settingValue}>{fontSize}px</Text>
            </View>

            {/* 테마 설정 */}
            <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>테마</Text>
                <View style={styles.themeOptions}>
                    <TouchableOpacity
                        style={[styles.themeOption, theme === 'light' && styles.selectedTheme]}
                        onPress={() => setTheme('light')}
                    >
                        <Text>라이트 모드</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.themeOption, theme === 'dark' && styles.selectedTheme]}
                        onPress={() => setTheme('dark')}
                    >
                        <Text>다크 모드</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 백업 설정 */}
            <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>채팅 기록 백업</Text>
                <Text style={styles.settingLabel}>주기 선택</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setBackupFrequency('daily')}
                >
                    <Text>일일 백업</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setBackupFrequency('weekly')}
                >
                    <Text>주간 백업</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setBackupFrequency('monthly')}
                >
                    <Text>월간 백업</Text>
                </TouchableOpacity>
                <Text>백업 파일 형식</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setBackupFormats('PDF')}
                >
                    <Text>PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setBackupFormats('TXT')}
                >
                    <Text>TXT</Text>
                </TouchableOpacity>
            </View>

            {/* 채팅 기록 보관 기간 설정 */}
            <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>채팅 기록 보관 기간</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setChatHistoryRetention('1_week')}
                >
                    <Text>1주</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setChatHistoryRetention('1_month')}
                >
                    <Text>1개월</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setChatHistoryRetention('6_months')}
                >
                    <Text>6개월</Text>
                </TouchableOpacity>
            </View>

            {/* 로그아웃 */}
            <View style={styles.settingItem}>
                <Button title="로그아웃" onPress={handleLogout} />
            </View>

            {/* 저장 버튼 */}
            <View style={styles.settingItem}>
                <Button title="설정 저장" onPress={saveSettings} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    settingItem: {
        marginBottom: 20,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    slider: {
        width: '100%',
    },
    settingValue: {
        fontSize: 14,
        textAlign: 'center',
    },
    themeOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    themeOption: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    selectedTheme: {
        backgroundColor: '#6200ee',
        color: '#fff',
    },
    button: {
        backgroundColor: '#6200ee',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
});

export default SettingsScreen;
