// screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';

const DashboardScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // 데이터 가져오기
        fetchNotifications();
        fetchTasks();
        fetchChats();
    }, []);

    // 서버에서 알림 가져오기
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/notifications`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    // 서버에서 작업 목록 가져오기
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/tasks`);
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        }
    };

    // 서버에서 채팅 목록 가져오기
    const fetchChats = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/chats`);
            setChats(response.data);
        } catch (error) {
            console.error('Failed to fetch chats', error);
        }
    };

    const handleNotificationClick = (id) => {
        Alert.alert('알림 상세', `알림 ID: ${id}`);
    };

    const handleTaskClick = () => {
        Alert.alert('작업 생성', '작업을 생성하세요!');
    };

    return (
        <ScrollView style={styles.container}>
            {/* 상단 통합 알림 및 공지 섹션 */}
            <Text style={styles.sectionTitle}>실시간 알림</Text>
            <FlatList
                data={notifications}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleNotificationClick(item.id)} style={styles.notificationCard}>
                        <Text style={styles.notificationText}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
            />

            {/* AI 지원 빠른 작업 허브 */}
            <Text style={styles.sectionTitle}>빠른 작업 허브</Text>
            <View style={styles.taskContainer}>
                <TouchableOpacity style={styles.taskButton} onPress={handleTaskClick}>
                    <Text style={styles.taskButtonText}>공지사항 작성</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.taskButton} onPress={handleTaskClick}>
                    <Text style={styles.taskButtonText}>투표 생성</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.taskButton} onPress={handleTaskClick}>
                    <Text style={styles.taskButtonText}>게시글 작성</Text>
                </TouchableOpacity>
            </View>

            {/* 스마트 채팅방 대시보드 */}
            <Text style={styles.sectionTitle}>채팅방</Text>
            <FlatList
                data={chats}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.chatCard}>
                        <View style={styles.chatHeader}>
                            <Text style={styles.chatTitle}>{item.name}</Text>
                            <Text style={styles.chatStatus}>{item.status}</Text>
                        </View>
                        <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    notificationCard: {
        backgroundColor: '#e0e5ec',
        padding: 15,
        borderRadius: 10,
        marginRight: 10,
    },
    notificationText: {
        fontSize: 16,
        color: '#333',
    },
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
    },
    taskButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
    },
    taskButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    chatCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        marginBottom: 15,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatStatus: {
        fontSize: 14,
        color: 'green',
    },
    chatLastMessage: {
        fontSize: 14,
        color: '#666',
    },
});

export default DashboardScreen;
