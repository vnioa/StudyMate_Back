import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, FlatList } from 'react-native';
import { Avatar } from 'react-native-paper';
import axios from 'axios';

const ChatRoomSettingsScreen = ({ route, navigation }) => {
    const { chatRoomId } = route.params;
    const [chatRoom, setChatRoom] = useState(null);
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        fetchChatRoomDetails();
    }, []);

    const fetchChatRoomDetails = async () => {
        try {
            const response = await axios.get(`http://121.127.165.43:3000/api/chat/${chatRoomId}/details`);
            setChatRoom(response.data.chatRoom);
        } catch (error) {
            console.error('채팅방 상세 정보 조회 오류:', error);
        }
    };

    const toggleNotifications = async () => {
        try {
            await axios.put(`http://121.127.165.43:3000/api/chat/${chatRoomId}/notifications`, {
                enabled: !notifications
            });
            setNotifications(!notifications);
        } catch (error) {
            console.error('알림 설정 변경 오류:', error);
        }
    };

    const leaveChatRoom = async () => {
        try {
            await axios.post(`http://121.127.165.43:3000/api/chat/${chatRoomId}/leave`);
            navigation.navigate('ChatList');
        } catch (error) {
            console.error('채팅방 나가기 오류:', error);
        }
    };

    const renderParticipant = ({ item }) => (
        <View style={styles.participantItem}>
            <Avatar.Image size={40} source={{ uri: item.profileImage }} />
            <Text style={styles.participantName}>{item.name}</Text>
        </View>
    );

    if (!chatRoom) {
        return <Text>로딩 중...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{chatRoom.name}</Text>
            <View style={styles.settingItem}>
                <Text>알림</Text>
                <Switch value={notifications} onValueChange={toggleNotifications} />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('SharedMedia', { chatRoomId })}
            >
                <Text style={styles.buttonText}>공유된 미디어</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>참여자</Text>
            <FlatList
                data={chatRoom.participants}
                renderItem={renderParticipant}
                keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity style={[styles.button, styles.leaveButton]} onPress={leaveChatRoom}>
                <Text style={styles.buttonText}>채팅방 나가기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    participantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    participantName: {
        marginLeft: 10,
        fontSize: 16,
    },
    leaveButton: {
        backgroundColor: '#FF0000',
        marginTop: 20,
    },
});

export default ChatRoomSettingsScreen;