import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import axios from 'axios';

const StudyGoalScreen = () => {
    const [dailyGoal, setDailyGoal] = useState(''); // 오늘의 목표 상태
    const [progress, setProgress] = useState(0); // 진행률 (0에서 1 사이)
    const [goalSaved, setGoalSaved] = useState(false); // 목표 저장 상태

    // 서버에서 학습 목표와 진행률을 가져오는 함수
    const fetchGoal = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/goals`);
            if (response.data) {
                setDailyGoal(response.data.dailyGoal); // 서버에서 가져온 목표 설정
                setProgress(response.data.progress); // 서버에서 가져온 진행률
            }
        } catch (error) {
            console.error("목표를 불러오는 중 오류가 발생했습니다:", error);
        }
    };

    // 학습 목표를 서버에 저장하는 함수
    const saveGoal = async () => {
        try {
            const response = await axios.post(`${process.env.API_URL}/goals`, { dailyGoal });
            if (response.status === 201) {
                Alert.alert('성공', '목표가 저장되었습니다.');
                setGoalSaved(true); // 목표 저장 성공 시 상태 업데이트
            }
        } catch (error) {
            console.error('목표 저장 중 오류가 발생했습니다:', error);
            Alert.alert('오류', '목표 저장에 실패했습니다.');
        }
    };

    // 컴포넌트가 처음 로드될 때 서버에서 목표를 가져옴
    useEffect(() => {
        fetchGoal();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>나의 학습 관리</Text>

            <Text style={styles.subTitle}>오늘의 학습 목표 설정</Text>
            <TextInput
                style={styles.input}
                placeholder="오늘의 목표를 입력하세요"
                value={dailyGoal}
                onChangeText={setDailyGoal}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveGoal}>
                <Text style={styles.saveButtonText}>목표 저장</Text>
            </TouchableOpacity>

            {/* 학습 진행률 차트 */}
            <Text style={styles.progressTitle}>학습 진행률</Text>
            <ProgressChart
                data={{ data: [progress] }} // 진행률은 0에서 1 사이로 표시
                width={Dimensions.get('window').width - 40}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={{
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientTo: '#08130D',
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    strokeWidth: 2,
                }}
                hideLegend={false}
            />

            <View style={styles.goalInfoContainer}>
                <Text style={styles.infoText}>
                    목표를 달성하지 못할 경우 경고 알림이 표시됩니다. 목표를 다시 설정하거나 조정할 수 있습니다.
                </Text>
            </View>
        </ScrollView>
    );
};

// 스타일링 개선
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#6200ee',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
        textAlign: 'center',
    },
    goalInfoContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default StudyGoalScreen;
