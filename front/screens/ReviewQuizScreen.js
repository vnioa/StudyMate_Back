import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const ReviewQuizScreen = () => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    // 복습 퀴즈 데이터 가져오기
    const fetchQuizzes = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/review-quizzes`);
            setQuizzes(response.data);
        } catch (error) {
            console.error('복습 퀴즈 데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>복습 퀴즈</Text>

            <FlatList
                data={quizzes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.question}>{item.question}</Text>
                        <TouchableOpacity style={styles.answerButton} onPress={() => Alert.alert(`정답: ${item.answer}`)}>
                            <Text style={styles.buttonText}>정답 보기</Text>
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
    question: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    answerButton: {
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

export default ReviewQuizScreen;
