import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

const AdvancedReportScreen = () => {
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        fetchReport();
    }, []);

    // 리포트 데이터 가져오기
    const fetchReport = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/advanced-report`);
            setReportData(response.data);
        } catch (error) {
            console.error('리포트를 가져오는 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>고급 성과 리포트</Text>

            <FlatList
                data={reportData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.reportTitle}>{item.title}</Text>
                        <Text>성과: {item.performance}</Text>
                        <Text>기간: {item.period}</Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.exportButton}>
                <Text style={styles.buttonText}>PDF로 내보내기</Text>
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
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    reportTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    exportButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#FF5722',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default AdvancedReportScreen;
