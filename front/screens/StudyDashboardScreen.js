// 필요한 라이브러리 및 모듈 import
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ProgressBar, ScrollView } from 'react-native';
import axios from 'axios';

// StudyDashboardScreen 컴포넌트 생성
const StudyDashboardScreen = () => {
    // 상태 선언: 학습 목표, 진행 상황, 체크리스트, 학습 기록, 알림
    const [dailyGoal, setDailyGoal] = useState({});
    const [weeklyGoal, setWeeklyGoal] = useState({});
    const [monthlyGoal, setMonthlyGoal] = useState({});
    const [checklist, setChecklist] = useState([]);
    const [studyRecords, setStudyRecords] = useState([]);

    // 서버로부터 학습 목표 및 진행 상황을 가져오는 함수
    const fetchGoals = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/goals`);
            setDailyGoal(response.data.daily);
            setWeeklyGoal(response.data.weekly);
            setMonthlyGoal(response.data.monthly);
        } catch (error) {
            console.error("Error fetching goals: ", error);
        }
    };

    // 서버로부터 체크리스트를 가져오는 함수
    const fetchChecklist = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/checklist`);
            setChecklist(response.data);
        } catch (error) {
            console.error("Error fetching checklist: ", error);
        }
    };

    // 서버로부터 학습 기록을 가져오는 함수
    const fetchStudyRecords = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/study-records`);
            setStudyRecords(response.data);
        } catch (error) {
            console.error("Error fetching study records: ", error);
        }
    };

    // 컴포넌트가 렌더링될 때 데이터 불러오기
    useEffect(() => {
        fetchGoals();
        fetchChecklist();
        fetchStudyRecords();
    }, []);

    return (
        <ScrollView>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Today's Goal</Text>
                <ProgressBar progress={dailyGoal.progress} />
                <Text>{dailyGoal.description}</Text>

                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Weekly Goal</Text>
                <ProgressBar progress={weeklyGoal.progress} />
                <Text>{weeklyGoal.description}</Text>

                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Monthly Goal</Text>
                <ProgressBar progress={monthlyGoal.progress} />
                <Text>{monthlyGoal.description}</Text>

                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Today's Checklist</Text>
                <FlatList
                    data={checklist}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ marginVertical: 10 }}>
                            <Text>{item.task}</Text>
                            <Button title={item.completed ? "Completed" : "Complete"} />
                        </View>
                    )}
                />

                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Last 7 Days Study Record</Text>
                {studyRecords.map((record, index) => (
                    <View key={index} style={{ marginVertical: 10 }}>
                        <Text>{record.date}: {record.hours} hours</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default StudyDashboardScreen;
