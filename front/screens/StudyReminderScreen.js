import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, FlatList } from 'react-native';
import axios from 'axios';

const StudyReminderScreen = () => {
    // 상태 선언: 리마인더 설정, 성취도, AI 추천 콘텐츠
    const [reminders, setReminders] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [aiRecommendations, setAiRecommendations] = useState([]);

    // 서버에서 리마인더 가져오기
    const fetchReminders = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/reminders`);
            setReminders(response.data);
        } catch (error) {
            console.error("Error fetching reminders: ", error);
        }
    };

    // 서버에서 성취도 및 AI 추천 콘텐츠 가져오기
    const fetchAchievements = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/achievements`);
            setAchievements(response.data);
        } catch (error) {
            console.error("Error fetching achievements: ", error);
        }
    };

    const fetchAiRecommendations = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/api/ai-recommendations`);
            setAiRecommendations(response.data);
        } catch (error) {
            console.error("Error fetching AI recommendations: ", error);
        }
    };

    useEffect(() => {
        fetchReminders();
        fetchAchievements();
        fetchAiRecommendations();
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Set Reminders</Text>
            <FlatList
                data={reminders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <Text>{item.task}</Text>
                        <Switch value={item.active} />
                    </View>
                )}
            />

            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Achievements</Text>
            <FlatList
                data={achievements}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <Text>{item.title} - {item.points} points</Text>
                    </View>
                )}
            />

            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>AI Recommended Content</Text>
            <FlatList
                data={aiRecommendations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <Text>{item.content}</Text>
                        <Button title="Learn More" />
                    </View>
                )}
            />
        </View>
    );
};

export default StudyReminderScreen;
