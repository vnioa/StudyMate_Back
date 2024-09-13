import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const SmartReviewScreen = () => {
    const [reviewSuggestions, setReviewSuggestions] = useState([]);

    useEffect(() => {
        fetchReviewSuggestions();
    }, []);

    // AI 기반 복습 주기 및 퀴즈 추천 가져오기
    const fetchReviewSuggestions = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/smart-review`);
            setReviewSuggestions(response.data);
        } catch (error) {
            console.error('복습 제안을 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>스마트 복습 시스템</Text>

            <FlatList
                data={reviewSuggestions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <Text style={styles.reviewText}>과목: {item.subject}</Text>
                        <Text style={styles.reviewText}>추천 복습 시기: {item.suggestedDate}</Text>
                        <TouchableOpacity style={styles.quizButton}>
                            <Text style={styles.buttonText}>퀴즈 풀기</Text>
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
    reviewItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    reviewText: {
        fontSize: 16,
    },
    quizButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default SmartReviewScreen;
