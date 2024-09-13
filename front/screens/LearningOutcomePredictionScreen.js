// screens/LearningOutcomePredictionScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const LearningOutcomePredictionScreen = () => {
    const [prediction, setPrediction] = useState('');

    useEffect(() => {
        fetchPrediction();
    }, []);

    const fetchPrediction = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/user/prediction`, {
                headers: { Authorization: `Bearer ${yourToken}` },
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('학습 성과 예측을 가져오는 중 오류가 발생했습니다.', error);
            Alert.alert('오류', '학습 성과 예측을 가져올 수 없습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI 학습 성과 예측</Text>
            <Text style={styles.prediction}>{prediction}</Text>
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
    prediction: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
    },
});

export default LearningOutcomePredictionScreen;
