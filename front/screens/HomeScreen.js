import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const HomeScreen = () => {
    const [progress, setProgress] = useState(0); // 학습 진행률

    // 서버에서 학습 진행률 데이터 가져오기
    const fetchProgress = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/progress`);
            setProgress(response.data.progress);
        } catch (error) {
            console.error('진행률을 불러오는 중 오류 발생:', error);
            Alert.alert('오류', '진행률을 불러오는 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>홈</Text>
            <Text style={styles.subTitle}>오늘의 학습 목표</Text>

            <ProgressChart
                data={{ data: [progress] }}
                width={Dimensions.get('window').width - 40}
                height={220}
                strokeWidth={16}
                radius={32}
                chartConfig={{
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientTo: '#08130D',
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                }}
                hideLegend={false}
            />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>오늘의 목표 보기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>타이머 시작</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#6200ee',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
