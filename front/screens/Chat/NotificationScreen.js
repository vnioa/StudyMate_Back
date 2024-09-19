// screens/NotificationScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
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

    const handleNotificationClick = (id) => {
        alert(`알림 상세보기: ${id}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>알림 목록</Text>
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.notificationItem} onPress={() => handleNotificationClick(item.id)}>
                        <Text style={styles.notificationText}>{item.title}</Text>
                        <Text style={styles.notificationTime}>{item.time}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    notificationItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    notificationText: {
        fontSize: 18,
        fontWeight: '500',
    },
    notificationTime: {
        fontSize: 14,
        color: '#666',
    },
});

export default NotificationScreen;
