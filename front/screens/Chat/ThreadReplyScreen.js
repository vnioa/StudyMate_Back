// screens/ThreadReplyScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';

const ThreadReplyScreen = ({ navigation, route }) => {
    const [mainMessage, setMainMessage] = useState(null);
    const [replies, setReplies] = useState([]);
    const [inputText, setInputText] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedReply, setSelectedReply] = useState(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const socket = useRef(null);

    useEffect(() => {
        fetchMainMessage();
        fetchReplies();
        connectSocket();
        return () => {
            socket.current.disconnect();
        };
    }, []);

    // 메시지 소켓 연결
    const connectSocket = () => {
        socket.current = io(process.env.API_URL);
        socket.current.on('connect', () => {
            console.log('Connected to server');
            socket.current.emit('joinThread', { threadId: route?.params?.threadId });
        });

        socket.current.on('newReply', (reply) => {
            setReplies((prevReplies) => [...prevReplies, reply]);
        });
    };

    // 주요 메시지 불러오기
    const fetchMainMessage = async () => {
        try {
            const response = await axios.get(
                `${process.env.API_URL}/threads/${route?.params?.threadId}/message`
            );
            setMainMessage(response.data);
        } catch (error) {
            console.error('Failed to fetch main message:', error);
            setShowError(true);
        }
    };

    // 답글 불러오기
    const fetchReplies = async () => {
        try {
            const response = await axios.get(
                `${process.env.API_URL}/threads/${route?.params?.threadId}/replies`
            );
            setReplies(response.data);
        } catch (error) {
            console.error('Failed to fetch replies:', error);
            setShowError(true);
        }
    };

    // 답글 작성
    const postReply = async () => {
        if (!inputText.trim()) return;

        const replyData = {
            threadId: route?.params?.threadId,
            content: inputText,
            sender: 'currentUserId', // 실제 사용자 ID 연동 필요
        };

        try {
            const response = await axios.post(
                `${process.env.API_URL}/threads/replies`,
                replyData
            );
            setReplies([...replies, response.data]);
            setInputText('');
            socket.current.emit('newReply', response.data);
        } catch (error) {
            console.error('Failed to post reply:', error);
            Alert.alert('오류', '답글을 작성하지 못했습니다.');
        }
    };

    // 답글 수정
    const editReply = async () => {
        if (!inputText.trim()) return;

        const updatedReply = {
            ...selectedReply,
            content: inputText,
        };

        try {
            await axios.put(
                `${process.env.API_URL}/threads/replies/${selectedReply.id}`,
                updatedReply
            );
            setReplies((prevReplies) =>
                prevReplies.map((reply) =>
                    reply.id === selectedReply.id ? updatedReply : reply
                )
            );
            setEditMode(false);
            setInputText('');
            setSelectedReply(null);
            socket.current.emit('editReply', updatedReply);
        } catch (error) {
            console.error('Failed to edit reply:', error);
            Alert.alert('오류', '답글을 수정하지 못했습니다.');
        }
    };

    // 답글 삭제
    const deleteReply = async (replyId) => {
        try {
            await axios.delete(`${process.env.API_URL}/threads/replies/${replyId}`);
            setReplies((prevReplies) =>
                prevReplies.filter((reply) => reply.id !== replyId)
            );
            setShowActionModal(false);
            socket.current.emit('deleteReply', replyId);
        } catch (error) {
            console.error('Failed to delete reply:', error);
            Alert.alert('오류', '답글을 삭제하지 못했습니다.');
        }
    };

    // 답글 선택 및 수정 모드 진입
    const handleEdit = (reply) => {
        setEditMode(true);
        setInputText(reply.content);
        setSelectedReply(reply);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {showError && (
                <Text style={styles.errorText}>
                    데이터를 불러오는 중 오류가 발생했습니다.
                </Text>
            )}
            {mainMessage && (
                <View style={styles.mainMessageContainer}>
                    <Text style={styles.mainMessageSender}>{mainMessage.senderName}</Text>
                    <Text style={styles.mainMessageContent}>{mainMessage.content}</Text>
                    <View style={styles.mainMessageActions}>
                        <TouchableOpacity
                            onPress={() => Alert.alert('수정 기능 준비 중')}
                            style={styles.actionButton}
                        >
                            <Icon name="pencil" size={20} color="#007bff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => Alert.alert('삭제 기능 준비 중')}
                            style={styles.actionButton}
                        >
                            <Icon name="trash" size={20} color="#ff4d4d" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* 답글 목록 */}
            <FlatList
                data={replies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onLongPress={() => {
                            setSelectedReply(item);
                            setShowActionModal(true);
                        }}
                        style={styles.replyContainer}
                    >
                        <View style={styles.reply}>
                            <Text style={styles.replySender}>{item.senderName}</Text>
                            <Text style={styles.replyContent}>{item.content}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.replyList}
            />

            {/* 답글 작성 및 수정 */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={editMode ? '답글 수정 중...' : '답글을 입력하세요...'}
                    placeholderTextColor="#888"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity
                    onPress={editMode ? editReply : postReply}
                    style={styles.sendButton}
                >
                    <Icon name={editMode ? 'checkmark' : 'send'} size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* 액션 모달 */}
            <Modal
                visible={showActionModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowActionModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            setShowActionModal(false);
                            handleEdit(selectedReply);
                        }}
                        style={styles.modalButton}
                    >
                        <Text style={styles.modalButtonText}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => deleteReply(selectedReply.id)}
                        style={styles.modalButton}
                    >
                        <Text style={styles.modalButtonText}>삭제</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowActionModal(false)}
                        style={styles.modalButton}
                    >
                        <Text style={styles.modalButtonText}>취소</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    mainMessageContainer: {
        padding: 15,
        backgroundColor: '#e9ecef',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    mainMessageSender: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    mainMessageContent: {
        fontSize: 16,
        color: '#333',
    },
    mainMessageActions: {
        flexDirection: 'row',
        marginTop: 10,
    },
    actionButton: {
        marginRight: 10,
    },
    replyList: {
        padding: 10,
    },
    replyContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    reply: {
        flexDirection: 'column',
    },
    replySender: {
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#333',
    },
    replyContent: {
        fontSize: 16,
        color: '#555',
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
    },
    sendButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
    },
    modalContainer: {
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
    modalButton: {
        padding: 15,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalButtonText: {
        fontSize: 18,
        color: '#007bff',
    },
    errorText: {
        color: '#ff4d4d',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default ThreadReplyScreen;
