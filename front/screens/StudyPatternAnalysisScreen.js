import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const StudyPatternAnalysisScreen = () => {
    const [analysis, setAnalysis] = useState(null);

    useEffect(() => {
        fetchAnalysis();
    }, []);

    // 학습 패턴 분석 데이터 가져오기
    const fetchAnalysis = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/study-pattern-analysis`);
            setAnalysis(response.data);
        } catch (error) {
            console.error('학습 패턴 분석을 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI 학습 패턴 분석</Text>

            {analysis ? (
                <View style={styles.analysisContainer}>
                    <Text style={styles.sectionTitle}>추천 학습 시간대</Text>
                    <Text>{analysis.recommendedTime}</Text>

                    <Text style={styles.sectionTitle}>목표 달성 가능성</Text>
                    <Text>{analysis.successProbability}%</Text>

                    <Text style={styles.sectionTitle}>추가 학습 필요 부분</Text>
                    <Text>{analysis.suggestedTopics.join(', ')}</Text>
                </View>
            ) : (
                <Text>분석 데이터를 불러오는 중...</Text>
            )}
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
    analysisContainer: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default StudyPatternAnalysisScreen;
