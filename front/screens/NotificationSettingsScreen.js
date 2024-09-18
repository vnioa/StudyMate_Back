import React, { useState, useEffect } from 'react';
import { View, Text, Switch, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const NotificationSettingsScreen = () => {
    // 상태 값: 알림 전체 설정 및 개별 채팅방 알림 상태
    const [globalNotification, setGlobalNotification] = useState(false);
    const [chatNotifications, setChatNotifications] = useState([]);

    // 서버에서 알림 설정 데이터를 가져오기
    const fetchNotificationSettings = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/notifications`);
            if (response.data) {
                setGlobalNotification(response.data.globalNotification);
                setChatNotifications(response.data.chatNotifications || []);
            }
        } catch (error) {
            console.error('알림 설정을 가져오는 중 오류가 발생했습니다:', error);
            Alert.alert('오류', '알림 설정을 가져오는 데 실패했습니다.');
        }
    };

    // 전체 알림 켜기/끄기
    const toggleGlobalNotification = async (value) => {
        try {
            await axios.put(`${process.env.API_URL}/notifications/global`, { globalNotification: value });
            setGlobalNotification(value);
        } catch (error) {
            console.error('전체 알림 설정 변경 중 오류가 발생했습니다:', error);
            Alert.alert('오류', '전체 알림 설정을 변경하는 데 실패했습니다.');
        }
    };

    // 개별 채팅방 알림 켜기/끄기
    const toggleChatNotification = async (chatId, value) => {
        try {
            const updatedNotifications = chatNotifications.map((chat) =>
                chat.id === chatId ? { ...chat, enabled: value } : chat
            );
            setChatNotifications(updatedNotifications);
            await axios.put(`${process.env.API_URL}/notifications/chat/${chatId}`, { enabled: value });
        } catch (error) {
            console.error('채팅방 알림 설정 변경 중 오류가 발생했습니다:', error);
            Alert.alert('오류', '채팅방 알림 설정을 변경하는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        // 페이지 로드 시 알림 설정 데이터를 가져오기
        fetchNotificationSettings();
    }, []);

    // 개별 채팅방 알림 항목 렌더링
    const renderChatNotificationItem = ({ item }) => (
        <View style={styles.chatNotificationItem}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Switch
                value={item.enabled}
                onValueChange={(value) => toggleChatNotification(item.id, value)}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>알림 설정</Text>

            <View style={styles.globalNotification}>
                <Text style={styles.globalNotificationText}>전체 알림</Text>
                <Switch
                    value={globalNotification}
                    onValueChange={toggleGlobalNotification}
                />
            </View>

            <Text style={styles.subtitle}>채팅방별 알림 설정</Text>
            <FlatList
                data={chatNotifications}
                renderItem={renderChatNotificationItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>채팅방이 없습니다.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    globalNotification: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    globalNotificationText: { fontSize: 18 },
    subtitle: { fontSize: 18, marginBottom: 10 },
    chatNotificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    chatName: { fontSize: 16 },
    emptyText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: '#888' },
});

export default NotificationSettingsScreen;
