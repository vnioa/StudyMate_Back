import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import axios from 'axios';

const StudyTimerScreen = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(1500); // 25분 타이머
    const [key, setKey] = useState(0); // 타이머 재시작을 위한 키
    const [focusMode, setFocusMode] = useState(false);

    // 타이머 종료 후 학습 기록 저장
    const saveStudyTime = async () => {
        try {
            await axios.post(`${process.env.API_URL}/study-time`, { duration });
            Alert.alert('학습 시간이 저장되었습니다.');
        } catch (error) {
            console.error('학습 시간 저장 중 오류가 발생했습니다:', error);
        }
    };

    // 타이머가 종료되었을 때 호출되는 함수
    const handleTimerComplete = () => {
        setIsPlaying(false);
        saveStudyTime();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>학습 타이머</Text>

            <CountdownCircleTimer
                key={key}
                isPlaying={isPlaying}
                duration={duration}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                onComplete={handleTimerComplete}
            >
                {({ remainingTime }) => (
                    <Text style={styles.timerText}>{Math.floor(remainingTime / 60)}:{remainingTime % 60}</Text>
                )}
            </CountdownCircleTimer>

            <TouchableOpacity
                style={styles.startButton}
                onPress={() => setIsPlaying(!isPlaying)}
            >
                <Text style={styles.buttonText}>{isPlaying ? '일시정지' : '시작'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                    setKey(prevKey => prevKey + 1);
                    setIsPlaying(false);
                }}
            >
                <Text style={styles.buttonText}>재설정</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.focusButton, focusMode && { backgroundColor: '#000' }]}
                onPress={() => setFocusMode(!focusMode)}
            >
                <Text style={styles.buttonText}>
                    {focusMode ? '집중 모드 해제' : '집중 모드 활성화'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    timerText: {
        fontSize: 48,
        color: '#333',
    },
    startButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    resetButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f44336',
        borderRadius: 5,
    },
    focusButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#000',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default StudyTimerScreen;
