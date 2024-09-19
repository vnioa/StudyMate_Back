// screens/ChatMainScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import io from 'socket.io-client';

const ChatMainScreen = ({ navigation, route }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [participants, setParticipants] = useState([]);
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'vote', 'announcement', 'post'
    const [modalData, setModalData] = useState({}); // 모달 데이터 저장
    const [selectedMessage, setSelectedMessage] = useState(null);
    const socket = useRef(null);

    // 서버에서 채팅 메시지 불러오기
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/chat/messages`, {
                params: { chatRoomId: route?.params?.chatRoomId },
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            Alert.alert('오류', '메시지를 불러오지 못했습니다.');
        }
    };

    // 서버와 소켓 연결
    useEffect(() => {
        socket.current = io(process.env.API_URL);

        socket.current.on('connect', () => {
            console.log('Connected to chat server');
            socket.current.emit('joinRoom', { chatRoomId: route?.params?.chatRoomId });
        });

        socket.current.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [route?.params?.chatRoomId]);

    // 메시지 전송
    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const messageData = {
            chatRoomId: route?.params?.chatRoomId,
            content: inputMessage,
            sender: 'currentUserId', // 실제 사용자 ID는 로그인 상태와 연동 필요
        };

        try {
            const response = await axios.post(`${process.env.API_URL}/chat/send`, messageData);
            setMessages([...messages, response.data]);
            setInputMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
            Alert.alert('오류', '메시지를 전송하지 못했습니다.');
        }
    };

    // 메시지 삭제
    const deleteMessage = async (messageId) => {
        try {
            await axios.delete(`${process.env.API_URL}/chat/messages/${messageId}`);
            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
        } catch (error) {
            console.error('Failed to delete message:', error);
            Alert.alert('오류', '메시지를 삭제하지 못했습니다.');
        }
    };

    // 사이드 패널에 참여자 목록 불러오기
    const fetchParticipants = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/chat/participants`, {
                params: { chatRoomId: route?.params?.chatRoomId },
            });
            setParticipants(response.data.participants);
        } catch (error) {
            console.error('Failed to load participants:', error);
        }
    };

    // 작업 저장 핸들러
    const handleSave = async () => {
        try {
            let response;
            switch (modalType) {
                case 'vote':
                    response = await axios.post(`${process.env.API_URL}/chat/vote/create`, modalData);
                    break;
                case 'announcement':
                    response = await axios.post(`${process.env.API_URL}/chat/announcement/create`, modalData);
                    break;
                case 'post':
                    response = await axios.post(`${process.env.API_URL}/chat/post/create`, modalData);
                    break;
                default:
                    return;
            }
            if (response.status === 200) {
                setShowActionModal(false);
                setModalData({});
                fetchMessages(); // 데이터 업데이트 후 메시지 새로고침
            }
        } catch (error) {
            console.error('Failed to save data', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        fetchParticipants();
    }, []);

    return (
        <View style={styles.container}>
            {/* 상단 정보 및 액션 바 */}
            <View style={styles.topBar}>
                <Text style={styles.chatRoomName}>{route?.params?.chatRoomName || '채팅방'}</Text>
                <TouchableOpacity onPress={() => setShowSidePanel(true)}>
                    <Icon name="person-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* 메시지 스트림 */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onLongPress={() => {
                            setSelectedMessage(item);
                            setShowActionModal(true);
                        }}
                        style={styles.messageContainer}
                    >
                        <View style={styles.message}>
                            <Text style={styles.messageSender}>{item.senderName}</Text>
                            <Text style={styles.messageContent}>{item.content}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.messagesList}
            />

            {/* 입력 도구 모음 */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    placeholder="메시지를 입력하세요..."
                    placeholderTextColor="#888"
                />
                <TouchableOpacity onPress={sendMessage}>
                    <Icon name="send" size={24} color="#007bff" />
                </TouchableOpacity>
            </View>

            {/* 기능 패널 */}
            <View style={styles.actionPanel}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setModalType('vote') || setShowActionModal(true)}>
                    <Text style={styles.actionButtonText}>투표 생성</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setModalType('announcement') || setShowActionModal(true)}
                >
                    <Text style={styles.actionButtonText}>공지 작성</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => setModalType('post') || setShowActionModal(true)}>
                    <Text style={styles.actionButtonText}>게시글 작성</Text>
                </TouchableOpacity>
            </View>

            {/* 사이드 패널 */}
            <Modal visible={showSidePanel} animationType="slide" onRequestClose={() => setShowSidePanel(false)}>
                <View style={styles.sidePanel}>
                    <Text style={styles.sidePanelTitle}>참여자 목록</Text>
                    <FlatList
                        data={participants}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.participantContainer}>
                                <Image source={{ uri: item.profilePicture }} style={styles.participantImage} />
                                <Text style={styles.participantName}>{item.name}</Text>
                            </View>
                        )}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowSidePanel(false)}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* 액션 모달 (메시지 수정, 삭제 등) */}
            <Modal visible={showActionModal} transparent={true} animationType="slide" onRequestClose={() => setShowActionModal(false)}>
                <View style={styles.actionModal}>
                    {modalType === '' ? (
                        <>
                            <TouchableOpacity onPress={() => deleteMessage(selectedMessage.id)}>
                                <Text style={styles.actionText}>삭제</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowActionModal(false)}>
                                <Text style={styles.actionText}>취소</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.modalTitle}>
                                {modalType === 'vote' ? '투표 생성' : modalType === 'announcement' ? '공지 작성' : '게시글 작성'}
                            </Text>
                            <ScrollView contentContainerStyle={styles.modalContent}>
                                {/* 투표, 공지, 게시글 입력 폼 */}
                                {modalType === 'vote' && (
                                    <View>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="투표 제목"
                                            value={modalData.title || ''}
                                            onChangeText={(text) => setModalData({ ...modalData, title: text })}
                                        />
                                        {/* 투표 옵션 추가 기능 */}
                                        <Text style={styles.optionLabel}>투표 옵션</Text>
                                        <FlatList
                                            data={modalData.options || []}
                                            renderItem={({ item, index }) => (
                                                <View style={styles.optionContainer}>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder={`옵션 ${index + 1}`}
                                                        value={item || ''}
                                                        onChangeText={(text) =>
                                                            setModalData({
                                                                ...modalData,
                                                                options: modalData.options.map((opt, i) => (i === index ? text : opt)),
                                                            })
                                                        }
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setModalData({
                                                                ...modalData,
                                                                options: modalData.options.filter((_, i) => i !== index),
                                                            })
                                                        }
                                                    >
                                                        <Icon name="close" size={24} color="#dc3545" />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                            keyExtractor={(_, index) => index.toString()}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setModalData({ ...modalData, options: [...(modalData.options || []), ''] })}
                                            style={styles.addOptionButton}
                                        >
                                            <Text style={styles.addOptionText}>옵션 추가</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {modalType === 'announcement' && (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="공지 내용을 입력하세요"
                                        value={modalData.content || ''}
                                        onChangeText={(text) => setModalData({ ...modalData, content: text })}
                                    />
                                )}
                                {modalType === 'post' && (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="게시글 제목"
                                        value={modalData.title || ''}
                                        onChangeText={(text) => setModalData({ ...modalData, title: text })}
                                    />
                                )}
                            </ScrollView>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                    <Text style={styles.saveButtonText}>저장</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowActionModal(false)} style={styles.cancelButton}>
                                    <Text style={styles.cancelButtonText}>취소</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    chatRoomName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    messagesList: {
        padding: 10,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#e9ecef',
    },
    message: {
        flexDirection: 'column',
    },
    messageSender: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
    messageContent: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#ffffff',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: '#f8f9fa',
    },
    sidePanel: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    sidePanelTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    participantContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    participantImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    participantName: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionPanel: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#f8f9fa',
    },
    actionButton: {
        padding: 10,
        backgroundColor: '#28a745',
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    actionModal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 18,
        marginVertical: 10,
        color: '#007bff',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    optionLabel: {
        fontSize: 16,
        marginVertical: 10,
        fontWeight: 'bold',
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    addOptionButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    addOptionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ChatMainScreen;
