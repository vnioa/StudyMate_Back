import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import axios from 'axios';

const PollSurveyScreen = () => {
    const [polls, setPolls] = useState([]);  // 투표 목록
    const [newPollTitle, setNewPollTitle] = useState('');  // 새 투표 제목
    const [newPollOptions, setNewPollOptions] = useState(['', '']);  // 새 투표 옵션
    const [selectedPoll, setSelectedPoll] = useState(null);  // 선택된 투표

    // 서버에서 투표 목록 불러오기
    const fetchPolls = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/polls`);
            setPolls(response.data || []);  // 데이터가 없으면 빈 리스트
        } catch (error) {
            console.error('투표 목록을 불러오는 중 오류 발생:', error);
        }
    };

    // 투표 생성 API 호출
    const createPoll = async () => {
        try {
            const response = await axios.post(`${process.env.API_URL}/polls`, {
                title: newPollTitle,
                options: newPollOptions,
            });
            if (response.status === 201) {
                Alert.alert('성공', '투표가 생성되었습니다.');
                fetchPolls();  // 새로 생성된 투표 목록을 갱신
            }
        } catch (error) {
            console.error('투표 생성 중 오류 발생:', error);
            Alert.alert('오류', '투표 생성에 실패했습니다.');
        }
    };

    // 투표 선택 및 결과 확인
    const selectPoll = async (pollId) => {
        try {
            const response = await axios.get(`${process.env.API_URL}/polls/${pollId}`);
            setSelectedPoll(response.data);  // 선택된 투표 결과 설정
        } catch (error) {
            console.error('투표 결과를 불러오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        fetchPolls();  // 컴포넌트가 로드될 때 투표 목록 불러오기
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>투표/설문 관리</Text>

            {/* 새 투표 생성 영역 */}
            <TextInput
                style={styles.input}
                placeholder="새 투표 제목을 입력하세요"
                value={newPollTitle}
                onChangeText={setNewPollTitle}
            />
            <FlatList
                data={newPollOptions}
                renderItem={({ item, index }) => (
                    <TextInput
                        style={styles.input}
                        placeholder={`옵션 ${index + 1}`}
                        value={item}
                        onChangeText={(text) => {
                            const newOptions = [...newPollOptions];
                            newOptions[index] = text;
                            setNewPollOptions(newOptions);
                        }}
                    />
                )}
                keyExtractor={(item, index) => `option-${index}`}
            />
            <Button title="투표 추가" onPress={createPoll} />

            {/* 기존 투표 목록 */}
            <Text style={styles.subtitle}>투표 목록</Text>
            <FlatList
                data={polls}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => selectPoll(item.id)}>
                        <View style={styles.pollItem}>
                            <Text style={styles.pollTitle}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
            />

            {/* 선택된 투표 결과 표시 */}
            {selectedPoll && (
                <View style={styles.pollResultContainer}>
                    <Text style={styles.pollTitle}>선택된 투표: {selectedPoll.title}</Text>
                    <PieChart
                        data={selectedPoll.options.map((option) => ({
                            name: option.text,
                            population: option.votes,
                            color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                            legendFontColor: '#7F7F7F',
                            legendFontSize: 15,
                        }))}
                        width={Dimensions.get('window').width - 40}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'left', color: '#333' },
    input: { height: 50, borderColor: '#ddd', borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10, backgroundColor: '#f9f9f9' },
    pollItem: { padding: 10, borderBottomColor: '#ddd', borderBottomWidth: 1 },
    pollTitle: { fontSize: 18, color: '#333' },
    pollResultContainer: { marginTop: 30, alignItems: 'center' },
});

export default PollSurveyScreen;
