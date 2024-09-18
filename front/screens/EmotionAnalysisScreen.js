import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

// 감정 분석 페이지 컴포넌트
const EmotionAnalysisScreen = () => {
    const [emotionData, setEmotionData] = useState([]);
    const [timelineData, setTimelineData] = useState([]);
    const [selectedEmotion, setSelectedEmotion] = useState(null);

    // 서버에서 감정 분석 데이터 가져오기
    const fetchEmotionData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/emotion-analysis`);
            if (response.data) {
                setEmotionData(response.data.emotionSummary);  // 감정 요약
                setTimelineData(response.data.timeline);  // 타임라인 데이터
            } else {
                setEmotionData([]);
                setTimelineData([]);
            }
        } catch (error) {
            console.error('감정 분석 데이터를 가져오는 중 오류 발생:', error);
            Alert.alert('오류', '감정 분석 데이터를 가져오는 데 실패했습니다.');
        }
    };

    // 감정에 맞는 추천 메시지 받아오기
    const fetchRecommendedMessages = async (emotion) => {
        try {
            const response = await axios.get(`${process.env.API_URL}/emotion-recommendation`, {
                params: { emotion }
            });
            if (response.data) {
                Alert.alert('추천 메시지', response.data.message);
            }
        } catch (error) {
            console.error('추천 메시지를 가져오는 중 오류 발생:', error);
        }
    };

    // 첫 로딩 시 데이터 가져오기
    useEffect(() => {
        fetchEmotionData();
    }, []);

    return (
        <View style={styles.container}>
            {/* 감정 분석 요약 */}
            <View style={styles.summaryContainer}>
                <Text style={styles.title}>감정 분석 요약</Text>
                <FlatList
                    data={emotionData}
                    keyExtractor={(item) => item.emotion}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.emotionItem}
                            onPress={() => {
                                setSelectedEmotion(item.emotion);
                                fetchRecommendedMessages(item.emotion);  // 추천 메시지 호출
                            }}
                        >
                            <Text style={styles.emotionText}>{item.emotion}</Text>
                            <Text style={styles.emotionPercentage}>{item.percentage}%</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* 감정 타임라인 */}
            <View style={styles.timelineContainer}>
                <Text style={styles.title}>감정 변화 타임라인</Text>
                {timelineData.length > 0 ? (
                    <LineChart
                        data={{
                            labels: timelineData.map((data) => data.time),
                            datasets: [
                                {
                                    data: timelineData.map((data) => data.value),
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 40}  // 전체 창 너비
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: '#f5f5f5',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                        }}
                        style={styles.chart}
                    />
                ) : (
                    <Text>감정 데이터가 없습니다.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    summaryContainer: { marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    emotionItem: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    emotionText: { fontSize: 18, color: '#555' },
    emotionPercentage: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    timelineContainer: { marginTop: 20 },
    chart: { marginVertical: 10 },
});

export default EmotionAnalysisScreen;
