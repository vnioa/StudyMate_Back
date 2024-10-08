// screens/myStudy/PerformanceAnalysisScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import axios from 'axios';

const PerformanceAnalysisScreen = () => {
    const [performanceData, setPerformanceData] = useState(null);

    useEffect(() => {
        fetchPerformanceData();
    }, []);

    const fetchPerformanceData = async () => {
        try {
            const response = await axios.get('http://121.127.165.43:3000/api/performance');
            setPerformanceData(response.data.data);
        } catch (error) {
            console.error('성과 데이터 조회 오류:', error);
        }
    };

    if (!performanceData) {
        return <Text>데이터를 불러오는 중...</Text>;
    }

    const gradeChartData = {
        labels: performanceData.grades.map(g => g.date),
        datasets: [{
            data: performanceData.grades.map(g => g.average_score)
        }]
    };

    const timeVsPerformanceData = {
        labels: performanceData.timeVsPerformance.map(t => t.date),
        datasets: [
            {
                data: performanceData.timeVsPerformance.map(t => t.study_hours),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            },
            {
                data: performanceData.timeVsPerformance.map(t => t.average_score),
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            }
        ]
    };

    const goalChartData = performanceData.goals.map(g => ({
        name: g.title,
        population: g.achievement_rate,
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    }));

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>성과 분석</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>학습 진도율</Text>
                <Text style={styles.progressText}>{performanceData.progress.toFixed(2)}%</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>성적 추이</Text>
                <LineChart
                    data={gradeChartData}
                    width={350}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>목표 달성 현황</Text>
                <PieChart
                    data={goalChartData}
                    width={350}
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>학습 시간 vs 성과</Text>
                <BarChart
                    data={timeVsPerformanceData}
                    width={350}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    progressText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});

export default PerformanceAnalysisScreen;