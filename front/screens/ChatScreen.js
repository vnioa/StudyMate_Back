import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Animated, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const initialMessages = [];

const ChatScreen = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputMessage, setInputMessage] = useState('');
    const [searchText, setSearchText] = useState('');
    const [filteredMessages, setFilteredMessages] = useState(messages);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [loading, setLoading] = useState(true);

    // 서버에서 메시지 가져오기
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/chat/messages`);
            const fetchedMessages = response.data.length ? response.data : [];
            setMessages(fetchedMessages);
            setFilteredMessages(fetchedMessages);
        } catch (error) {
            console.error('메시지 불러오기 중 오류 발생:', error);
        } finally {
            setLoading(false); // 로딩 완료
        }
    };

    // 메시지 전송 기능
    const sendMessage = async () => {
        if (inputMessage.trim()) {
            try {
                const response = await axios.post(`${process.env.API_URL}/chat/messages`, {
                    text: inputMessage,
                });

                if (response.status === 201) {
                    const newMessage = response.data;
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                    setFilteredMessages(prevMessages => [...prevMessages, newMessage]);
                    setInputMessage('');
                }
            } catch (error) {
                console.error('메시지 전송 중 오류 발생:', error);
            }
        }
    };

    // 메시지 읽음 상태 애니메이션 로직
    const handleReadStatusAnimation = () => {
        // 애니메이션 설정: 읽음 상태가 변경되면 깜박이는 효과
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1, // 불투명하게
                duration: 500, // 500ms 동안 지속
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0, // 다시 투명하게
                duration: 500, // 500ms 동안 지속
                useNativeDriver: true,
            })
        ]).start();
    };

    useEffect(() => {
        fetchMessages();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    // 검색 필터링
    useEffect(() => {
        if (searchText) {
            setFilteredMessages(
                messages.filter(message =>
                    message.text.toLowerCase().includes(searchText.toLowerCase())
                )
            );
        } else {
            setFilteredMessages(messages);
        }
    }, [searchText, messages]);

    return (
        <View style={styles.container}>
            {/* 상단바: 검색창 및 상태 아이콘 */}
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="채팅 검색"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <View style={styles.statusIcons}>
                    <Ionicons name="videocam" size={24} color="green" />
                    <Ionicons name="lock-closed" size={24} color="red" />
                </View>
            </View>

            {/* 채팅 목록 */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredMessages}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.messageItem}>
                            <Text>{item.text}</Text>
                            {/* 읽음 여부 애니메이션 */}
                            {item.read && (
                                <Animated.View style={{ opacity: fadeAnim }}>
                                    <Ionicons name="checkmark-done" size={16} color="blue" />
                                </Animated.View>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text>채팅 내역이 없습니다.</Text>
                        </View>
                    )}
                />
            )}

            {/* 하단 입력창 */}
            <View style={styles.inputContainer}>
                <TouchableOpacity>
                    <Ionicons name="happy" size={24} color="gray" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="메시지 입력"
                    value={inputMessage}
                    onChangeText={setInputMessage}
                />
                <TouchableOpacity onPress={sendMessage}>
                    <Ionicons name="send" size={24} color="blue" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    searchInput: { height: 40, borderColor: '#ddd', borderWidth: 1, flex: 1, marginRight: 10, paddingHorizontal: 10 },
    statusIcons: { flexDirection: 'row' },
    messageItem: { padding: 10, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' },
    emptyContainer: { alignItems: 'center', marginTop: 20 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#eee' },
    input: { flex: 1, height: 40, borderColor: '#ddd', borderWidth: 1, paddingHorizontal: 10, borderRadius: 5 },
});

export default ChatScreen;
