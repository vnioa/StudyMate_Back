import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';

const AchievementScreen = () => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        fetchAchievements();
    }, []);

    // 성취도 및 보상 데이터 가져오기
    const fetchAchievements = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/achievements`);
            setAchievements(response.data);
        } catch (error) {
            console.error('성취도 및 보상 정보를 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>나의 성취도</Text>

            <FlatList
                data={achievements}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.badgeTitle}>{item.title}</Text>
                        <Text>{item.description}</Text>
                        <Text style={styles.points}>포인트: {item.points}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    badgeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    points: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});

export default AchievementScreen;
