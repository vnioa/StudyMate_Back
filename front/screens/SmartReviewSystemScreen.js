// screens/SmartReviewSystemScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';

const SmartReviewSystemScreen = () => {
    const [reviewData, setReviewData] = useState([]);
    const [quiz, setQuiz] = useState([]);

    useEffect(() => {
        fetchReviewData();
    }, []);

    const fetchReviewData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user/review`, {
                headers: { Authorization: `Bearer ${yourToken}` },
            });
            setReviewData(response.data.reviews);
        } catch (error) {
            console.error('복습 데이터를 가져오는 중 오류가 발생했습니다.', error);
            Alert.alert('오류', '복습 데이터를 가져올 수 없습니다.');
        }
    };

    const fetchQuiz = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user/quiz`, {
                headers: { Authorization: `Bearer ${yourToken}` },
            });
            setQuiz(response.data.quiz);
        } catch (error) {
            console.error('퀴즈 데이터를 가져오는 중 오류가 발생했습니다.', error);
            Alert.alert('오류', '퀴즈 데이터를 가져올 수 없습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>스마트 복습 시스템</Text>
            <FlatList
                data={reviewData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.reviewContent}</Text>
                    </View>
                )}
            />
            <TouchableOpacity onPress={fetchQuiz} style={styles.quizButton}>
                <Text style={styles.quizButtonText}>퀴즈 가져오기</Text>
            </TouchableOpacity>
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
        color: '#000',
        textAlign: 'center',
    },
    item: {
        padding: 15,
        backgroundColor: '#f1f1f1',
        marginBottom: 10,
        borderRadius: 10,
    },
    itemText: {
        fontSize: 18,
        color: '#000',
    },
    quizButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    quizButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default SmartReviewSystemScreen;
