// screens/myStudy/TimerScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import axios from 'axios';

const TimerScreen = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [subject, setSubject] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        fetchTimerHistory();
    }, []);

    const fetchTimerHistory = async () => {
        try {
            const response = await axios.get('http://121.127.165.43:3000/api/timer/history');
            setHistory(response.data.history);
        } catch (error) {
            console.error('타이머 기록 조회 오류:', error);
        }
    };

    const startTimer = async () => {
        try {
            const response = await axios.post('http://121.127.165.43:3000/api/timer/start', { subject });
            setSessionId(response.data.sessionId);
            setIsRunning(true);
        } catch (error) {
            console.error('타이머 시작 오류:', error);
        }
    };

    const stopTimer = async () => {
        try {
            await axios.put(`http://121.127.165.43:3000/api/timer/stop/${sessionId}`);
            setIsRunning(false);
            setTime(0);
            setSessionId(null);
            fetchTimerHistory();
        } catch (error) {
            console.error('타이머 정지 오류:', error);
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderHistoryItem = ({ item }) => (
        <View style={styles.historyItem}>
            <Text>{item.subject}</Text>
            <Text>{new Date(item.start_time).toLocaleString()}</Text>
            <Text>{formatTime(item.duration)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.timerText}>{formatTime(time)}</Text>
            <TextInput
                label="학습 주제"
                value={subject}
                onChangeText={setSubject}
                style={styles.input}
                disabled={isRunning}
            />
            {!isRunning ? (
                <Button mode="contained" onPress={startTimer} disabled={!subject}>
                    시작
                </Button>
            ) : (
                <Button mode="contained" onPress={stopTimer}>
                    정지
                </Button>
            )}
            <Text style={styles.historyTitle}>학습 기록</Text>
            <FlatList
                data={history}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    timerText: {
        fontSize: 48,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginBottom: 20,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default TimerScreen;