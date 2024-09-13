import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';

const StudyReportScreen = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, []);

    // 서버에서 성과 데이터를 가져옴
    const fetchReportData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/study-report`);
            setReportData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('학습 성과 데이터를 가져오는 중 오류가 발생했습니다:', error);
            setLoading(false);
        }
    };

    // 리포트 저장
    const saveReport = async () => {
        try {
            await axios.post(`${process.env.API_URL}/save-report`);
            Alert.alert('리포트가 저장되었습니다.');
        } catch (error) {
            console.error('리포트 저장 중 오류가 발생했습니다:', error);
        }
    };

    if (loading) {
        return <Text>로딩 중...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>학습 성과 분석</Text>

            <BarChart
                data={{
                    labels: reportData.labels,
                    datasets: [
                        {
                            data: reportData.data,
                        },
                    ],
                }}
                width={350}
                height={220}
                yAxisSuffix="시간"
                chartConfig={{
                    backgroundColor: '#f5f5f5',
                    backgroundGradientFrom: '#f5f5f5',
                    backgroundGradientTo: '#f5f5f5',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                }}
                style={styles.chart}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveReport}>
                <Text style={styles.buttonText}>리포트 저장</Text>
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
    chart: {
        marginBottom: 30,
    },
    saveButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default StudyReportScreen;
