import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const CustomThemeScreen = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 서버에서 사용자의 현재 테마를 가져옵니다.
    useEffect(() => {
        fetchUserTheme();
    }, []);

    // 사용자의 현재 테마를 서버에서 가져오는 함수
    const fetchUserTheme = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user/theme`, {
                headers: { Authorization: `Bearer ${yourToken}` } // 인증 토큰 필요시 포함
            });
            setIsDarkMode(response.data.isDarkMode);
        } catch (error) {
            console.error('테마를 가져오는 중 오류가 발생했습니다.', error);
        }
    };

    // 사용자가 테마 변경 후 서버에 저장하는 함수
    const saveUserTheme = async () => {
        try {
            await axios.post(
                `${process.env.API_URL}/user/theme`,
                { isDarkMode },
                { headers: { Authorization: `Bearer ${yourToken}` } } // 인증 토큰 필요시 포함
            );
            Alert.alert('성공', '테마 설정이 저장되었습니다.');
        } catch (error) {
            console.error('테마를 저장하는 중 오류가 발생했습니다.', error);
            Alert.alert('오류', '테마 설정 저장에 실패했습니다.');
        }
    };

    // 테마 변경을 위한 함수
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <View style={isDarkMode ? styles.containerDark : styles.containerLight}>
            <Text style={styles.title}>테마 설정</Text>

            <View style={styles.option}>
                <Text style={styles.label}>다크 모드</Text>
                <Switch value={isDarkMode} onValueChange={toggleTheme} />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveUserTheme}>
                <Text style={styles.buttonText}>설정 저장</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    containerLight: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    containerDark: {
        flex: 1,
        padding: 20,
        backgroundColor: '#333',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#000',
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        color: '#000',
    },
    saveButton: {
        padding: 15,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default CustomThemeScreen;
