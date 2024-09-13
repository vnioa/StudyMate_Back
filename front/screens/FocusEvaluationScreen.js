import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const FocusEvaluationScreen = () => {
    const [evaluation, setEvaluation] = useState(null);

    useEffect(() => {
        fetchEvaluation();
    }, []);

    // 집중도 평가 데이터 가져오기
    const fetchEvaluation = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/focus-evaluation`);
            setEvaluation(response.data);
        } catch (error) {
            console.error('집중도 평가 데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>학습 집중도 평가</Text>

            {evaluation ? (
                <View style={styles.evaluationContainer}>
                    <Text style={styles.sectionTitle}>현재 집중도: {evaluation.currentFocus}%</Text>
                    <Text>평균 집중 시간: {evaluation.averageFocusTime}분</Text>
                    <Text>개선 방안: {evaluation.recommendation}</Text>
                </View>
            ) : (
                <Text>평가 데이터를 불러오는 중입니다...</Text>
            )}

            <TouchableOpacity style={styles.retestButton}>
                <Text style={styles.buttonText}>재평가하기</Text>
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
    },
    evaluationContainer: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    retestButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default FocusEvaluationScreen;
