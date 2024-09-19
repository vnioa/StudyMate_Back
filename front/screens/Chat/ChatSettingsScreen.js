import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Image, Modal, Alert, Switch } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatSettingsScreen = ({ navigation, route }) => {
    const [theme, setTheme] = useState('light');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [participants, setParticipants] = useState([]);
    const [isSecretChat, setIsSecretChat] = useState(false);
    const [passwordProtected, setPasswordProtected] = useState(false);
    const [chatPassword, setChatPassword] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showThemeModal, setShowThemeModal] = useState(false);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [newParticipant, setNewParticipant] = useState('');

    useEffect(() => {
        fetchSettings();
        fetchParticipants();
    }, []);

    // Fetch existing chat settings
    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/chat/settings`, {
                params: { chatRoomId: route?.params?.chatRoomId },
            });
            const { theme, backgroundImage, isSecretChat, passwordProtected } = response.data;
            setTheme(theme);
            setBackgroundImage(backgroundImage);
            setIsSecretChat(isSecretChat);
            setPasswordProtected(passwordProtected);
        } catch (error) {
            console.error('Failed to fetch chat settings:', error);
            Alert.alert('오류', '설정을 불러오지 못했습니다.');
        }
    };

    // Fetch participants of the chat room
    const fetchParticipants = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/chat/participants`, {
                params: { chatRoomId: route?.params?.chatRoomId },
            });
            setParticipants(response.data.participants);
        } catch (error) {
            console.error('Failed to load participants:', error);
            Alert.alert('오류', '참여자 목록을 불러오지 못했습니다.');
        }
    };

    // Save theme and background image settings
    const saveThemeSettings = async () => {
        try {
            await axios.post(`${process.env.API_URL}/chat/settings/theme`, {
                chatRoomId: route?.params?.chatRoomId,
                theme,
                backgroundImage,
            });
            Alert.alert('성공', '테마 설정이 저장되었습니다.');
            setShowThemeModal(false);
        } catch (error) {
            console.error('Failed to save theme settings:', error);
            Alert.alert('오류', '테마 설정을 저장하지 못했습니다.');
        }
    };

    // Toggle secret chat setting
    const toggleSecretChat = async () => {
        try {
            await axios.post(`${process.env.API_URL}/chat/settings/secret`, {
                chatRoomId: route?.params?.chatRoomId,
                isSecretChat: !isSecretChat,
            });
            setIsSecretChat(!isSecretChat);
            Alert.alert('성공', '비밀 채팅 설정이 변경되었습니다.');
        } catch (error) {
            console.error('Failed to toggle secret chat:', error);
            Alert.alert('오류', '비밀 채팅 설정을 변경하지 못했습니다.');
        }
    };

    // Set or remove password protection
    const handlePasswordProtection = async () => {
        try {
            await axios.post(`${process.env.API_URL}/chat/settings/password`, {
                chatRoomId: route?.params?.chatRoomId,
                passwordProtected: !passwordProtected,
                chatPassword: passwordProtected ? '' : chatPassword,
            });
            setPasswordProtected(!passwordProtected);
            setShowPasswordModal(false);
            Alert.alert('성공', passwordProtected ? '채팅방 잠금이 해제되었습니다.' : '채팅방이 비밀번호로 보호되었습니다.');
        } catch (error) {
            console.error('Failed to update password protection:', error);
            Alert.alert('오류', '비밀번호 보호 설정을 변경하지 못했습니다.');
        }
    };

    // Add new participant
    const addParticipant = async () => {
        try {
            await axios.post(`${process.env.API_URL}/chat/participants/add`, {
                chatRoomId: route?.params?.chatRoomId,
                participantEmail: newParticipant,
            });
            fetchParticipants();
            setNewParticipant('');
            Alert.alert('성공', '참여자가 추가되었습니다.');
        } catch (error) {
            console.error('Failed to add participant:', error);
            Alert.alert('오류', '참여자를 추가하지 못했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            {/* 상단 정보 및 빠른 설정 바 */}
            <View style={styles.header}>
                <Text style={styles.title}>채팅방 설정</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="close" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            {/* 테마 및 배경 설정 섹션 */}
            <TouchableOpacity style={styles.settingItem} onPress={() => setShowThemeModal(true)}>
                <Text style={styles.settingText}>테마 및 배경 설정</Text>
                <Icon name="chevron-forward-outline" size={20} color="#666" />
            </TouchableOpacity>

            {/* 보안 및 접근 설정 */}
            <View style={styles.settingItem}>
                <Text style={styles.settingText}>비밀 채팅</Text>
                <Switch value={isSecretChat} onValueChange={toggleSecretChat} />
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={() => setShowPasswordModal(true)}>
                <Text style={styles.settingText}>비밀번호 보호</Text>
                <Icon name={passwordProtected ? 'lock-closed' : 'lock-open'} size={20} color="#666" />
            </TouchableOpacity>

            {/* 멤버 관리 인터페이스 */}
            <TouchableOpacity style={styles.settingItem} onPress={() => setShowParticipantsModal(true)}>
                <Text style={styles.settingText}>멤버 관리</Text>
                <Icon name="people-outline" size={20} color="#666" />
            </TouchableOpacity>

            {/* 테마 설정 모달 */}
            <Modal visible={showThemeModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>테마 및 배경 설정</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="배경 이미지 URL 입력"
                        value={backgroundImage}
                        onChangeText={setBackgroundImage}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={saveThemeSettings}>
                        <Text style={styles.saveButtonText}>저장</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowThemeModal(false)}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* 비밀번호 보호 설정 모달 */}
            <Modal visible={showPasswordModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>비밀번호 설정</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="비밀번호 입력"
                        value={chatPassword}
                        onChangeText={setChatPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handlePasswordProtection}>
                        <Text style={styles.saveButtonText}>저장</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowPasswordModal(false)}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* 멤버 관리 모달 */}
            <Modal visible={showParticipantsModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>멤버 관리</Text>
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
                    <TextInput
                        style={styles.input}
                        placeholder="참여자 이메일 입력"
                        value={newParticipant}
                        onChangeText={setNewParticipant}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={addParticipant}>
                        <Text style={styles.saveButtonText}>추가</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowParticipantsModal(false)}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    settingText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#ff4d4d',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    participantContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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
});

export default ChatSettingsScreen;
