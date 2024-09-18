import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const HomeScreen = () => {
    // 상태 관리
    const [progress, setProgress] = useState(0);
    const [dailyGoal, setDailyGoal] = useState('');
    const [checklist, setChecklist] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [reminder, setReminder] = useState('');

    // 서버에서 데이터를 가져오기 위한 함수들
    const fetchData = async () => {
        try {
            const progressRes = await axios.get(`${process.env.API_URL}/progress`);
            setProgress(progressRes.data.progress);

            const dailyGoalRes = await axios.get(`${process.env.API_URL}/daily-goal`);
            setDailyGoal(dailyGoalRes.data.goal);

            const checklistRes = await axios.get(`${process.env.API_URL}/checklist`);
            setChecklist(checklistRes.data);

            const recentActivityRes = await axios.get(`${process.env.API_URL}/recent-activity`);
            setRecentActivity(recentActivityRes.data);

            const reminderRes = await axios.get(`${process.env.API_URL}/reminder`);
            setReminder(reminderRes.data.message);
        } catch (error) {
            console.error('데이터를 불러오는 중 오류 발생:', error);
            Alert.alert('오류', '데이터를 불러오는 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>홈</Text>

            {/* 오늘의 학습 목표 */}
            <Text style={styles.subTitle}>오늘의 학습 목표</Text>
            <ProgressChart
                data={{ data: [progress] }}
                width={Dimensions.get('window').width - 40}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={{
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientTo: '#08130D',
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                }}
                hideLegend={false}
            />
            <Text style={styles.goalText}>{dailyGoal}</Text>

            {/* 최근 활동 */}
            <Text style={styles.subTitle}>최근 활동</Text>
            {recentActivity.map((activity, index) => (
                <Text key={index} style={styles.activityText}>{activity}</Text>
            ))}

            {/* 할 일 체크리스트 */}
            <Text style={styles.subTitle}>할 일 체크리스트</Text>
            {checklist.length > 0 ? (
                checklist.map((item, index) => (
                    <Text key={index} style={styles.checklistItem}>{item}</Text>
                ))
            ) : (
                <Text>할 일이 없습니다.</Text>
            )}

            {/* 학습 리마인더 */}
            <Text style={styles.subTitle}>리마인더</Text>
            <Text style={styles.reminderText}>{reminder}</Text>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>타이머 시작</Text>
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
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    goalText: {
        fontSize: 18,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    activityText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    checklistItem: {
        fontSize: 16,
        color: '#007BFF',
        marginBottom: 5,
    },
    reminderText: {
        fontSize: 16,
        color: '#FF0000',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6200ee',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
