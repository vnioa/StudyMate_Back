import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// 그룹 채팅방 페이지
const GroupChatScreen = () => {
    const [groupName, setGroupName] = useState('스터디 그룹');
    const [onlineMembers, setOnlineMembers] = useState(5);
    const [totalMembers, setTotalMembers] = useState(10);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [polls, setPolls] = useState([]);
    const [isSurveyOpen, setSurveyOpen] = useState(false);

    // 서버에서 데이터 가져오기
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/group/chat`);
            setMessages(response.data.messages || []);
            setPinnedMessages(response.data.pinnedMessages || []);
            setMediaFiles(response.data.mediaFiles || []);
            setPolls(response.data.polls || []);
        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
        }
    };

    // 메시지 전송
    const sendMessage = async () => {
        if (!message) return;
        try {
            const response = await axios.post(`${process.env.API_URL}/group/message`, { text: message });
            setMessages([...messages, response.data]);
            setMessage('');
        } catch (error) {
            console.error('메시지 전송 실패:', error);
        }
    };

    // 공지사항 팝업 열기
    const openAnnouncementPopup = () => {
        alert('공지사항 팝업 열기');
    };

    // 실시간 설문조사 팝업 열기
    const createSurvey = () => {
        setSurveyOpen(true);
    };

    useEffect(() => {
        fetchData(); // 컴포넌트가 로드될 때 서버에서 데이터를 불러옴
    }, []);

    return (
        <View style={styles.container}>
            {/* 상단 그룹 정보 및 공지사항 버튼 */}
            <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{groupName}</Text>
                <Text style={styles.memberCount}>{onlineMembers}/{totalMembers} 명 온라인</Text>
                <TouchableOpacity onPress={openAnnouncementPopup}>
                    <Ionicons name="ios-megaphone" size={24} color="black" />
                </TouchableOpacity>
                <Ionicons name="ios-notifications" size={24} color="red" />
            </View>

            {/* 중앙 채팅 메시지 및 핀 메시지 표시 */}
            <FlatList
                data={pinnedMessages}
                renderItem={({ item }) => (
                    <View style={styles.pinnedMessage}>
                        <Text>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={() => (
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => (
                            <View style={styles.messageContainer}>
                                <Text>{item.text}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                    />
                )}
            />

            {/* 하단 입력창 및 전송 버튼 */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="메시지 입력"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity onPress={sendMessage}>
                    <Ionicons name="send" size={24} color="blue" />
                </TouchableOpacity>
            </View>

            {/* 실시간 설문조사 버튼 */}
            <TouchableOpacity onPress={createSurvey}>
                <Ionicons name="ios-poll" size={24} color="green" />
                <Text>설문조사 생성</Text>
            </TouchableOpacity>

            {/* 미디어 파일 보기 */}
            <FlatList
                data={mediaFiles}
                renderItem={({ item }) => <Image source={{ uri: item.url }} style={styles.mediaThumbnail} />}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    groupName: { fontSize: 24, fontWeight: 'bold' },
    memberCount: { fontSize: 16, color: 'gray' },
    pinnedMessage: { backgroundColor: '#f8f9fa', padding: 10, marginVertical: 5 },
    messageContainer: { padding: 10, marginVertical: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ddd', padding: 10 },
    input: { flex: 1, borderColor: '#ddd', borderWidth: 1, padding: 10, borderRadius: 5 },
    mediaThumbnail: { width: 100, height: 100, margin: 5 }
});

export default GroupChatScreen;
