import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const AIContentRecommendationScreen = () => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    // AI 콘텐츠 추천 데이터 가져오기
    const fetchRecommendations = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/ai-recommendations`);
            setRecommendations(response.data);
        } catch (error) {
            console.error('AI 콘텐츠 추천을 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI 맞춤 학습 콘텐츠 추천</Text>

            <FlatList
                data={recommendations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.contentTitle}>{item.title}</Text>
                        <Text>{item.description}</Text>
                        <TouchableOpacity style={styles.linkButton} onPress={() => Alert.alert(`${item.title} 열기`)}>
                            <Text style={styles.buttonText}>콘텐츠 열기</Text>
                        </TouchableOpacity>
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
    contentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default AIContentRecommendationScreen;
