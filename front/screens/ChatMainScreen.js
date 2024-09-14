import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
} from 'react-native';
import axios from 'axios';

// 채팅 관련 아이콘 불러오기
import chatIcon from './assets/chatting.png';
import groupIcon from './assets/group.png';
import createIcon from './assets/create.png';
import pinIcon from './assets/pin.png';
import deleteIcon from './assets/delete.png';
import stickerIcon from './assets/sticker.png';
import emojiIcon from './assets/emoji.png';

const ChatMainScreen = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [filteredChatRooms, setFilteredChatRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fixedChatRooms, setFixedChatRooms] = useState([]);
    const [filterOption, setFilterOption] = useState('all'); // 'all', 'personal', 'group'

    // 서버에서 채팅방 목록을 불러옴
    const fetchChatRooms = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.API_URL}/chatrooms`);
            setChatRooms(response.data.chatRooms);
            setFilteredChatRooms(response.data.chatRooms);
            setIsLoading(false);
        } catch (error) {
            console.error('채팅방 목록을 불러오는 중 오류 발생:', error);
            setIsLoading(false);
        }
    };

    // 실시간 검색 필터링
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.length > 0) {
            const filtered = chatRooms.filter((room) =>
                room.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredChatRooms(filtered);
        } else {
            setFilteredChatRooms(chatRooms);
        }
    };

    // 채팅방 필터링 (개인/그룹)
    const filterChatRooms = (option) => {
        setFilterOption(option);
        if (option === 'personal') {
            const personalChats = chatRooms.filter((room) => room.type === 'personal');
            setFilteredChatRooms(personalChats);
        } else if (option === 'group') {
            const groupChats = chatRooms.filter((room) => room.type === 'group');
            setFilteredChatRooms(groupChats);
        } else {
            setFilteredChatRooms(chatRooms); // 전체 표시
        }
    };

    // 채팅방 고정 기능
    const pinChatRoom = (id) => {
        setFixedChatRooms([...fixedChatRooms, id]);
    };

    // 채팅방 삭제 기능
    const deleteChatRoom = (id) => {
        const updatedRooms = chatRooms.filter((room) => room.id !== id);
        setChatRooms(updatedRooms);
        setFilteredChatRooms(updatedRooms);
    };

    useEffect(() => {
        fetchChatRooms();
    }, []);

    const renderChatRoomItem = ({ item }) => (
        <View style={styles.chatRoomContainer}>
            <TouchableOpacity style={styles.chatRoomItem} onPress={() => Alert.alert('채팅방 진입')}>
                <Image source={item.type === 'group' ? groupIcon : chatIcon} style={styles.icon} />
                <View style={styles.chatRoomInfo}>
                    <Text style={styles.chatRoomName}>{item.name}</Text>
                    <Text style={styles.chatRoomLastMessage}>{item.lastMessage || '최근 메시지 없음'}</Text>
                </View>
                {/* 미디어 미리보기 */}
                {item.media && <Image source={{ uri: item.media.thumbnail }} style={styles.mediaPreview} />}
                {/* 읽지 않은 메시지 개수 표시 */}
                {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unreadCount}</Text>
                    </View>
                )}
                {/* 고정/삭제 아이콘 */}
                <TouchableOpacity onPress={() => pinChatRoom(item.id)}>
                    <Image source={pinIcon} style={styles.iconAction} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteChatRoom(item.id)}>
                    <Image source={deleteIcon} style={styles.iconAction} />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* 상단 검색창 */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="채팅방 검색..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {/* 필터링 버튼 */}
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => filterChatRooms('all')}>
                    <Text style={filterOption === 'all' ? styles.activeFilter : styles.filterText}>전체</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => filterChatRooms('personal')}>
                    <Text style={filterOption === 'personal' ? styles.activeFilter : styles.filterText}>개인</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => filterChatRooms('group')}>
                    <Text style={filterOption === 'group' ? styles.activeFilter : styles.filterText}>그룹</Text>
                </TouchableOpacity>
            </View>

            {/* 채팅방 목록 */}
            <FlatList
                data={filteredChatRooms}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderChatRoomItem}
                refreshing={isLoading}
                onRefresh={fetchChatRooms}
                ListEmptyComponent={<Text>채팅방이 없습니다.</Text>}
            />

            {/* 하단 스티커 및 이모티콘 전송 기능 */}
            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.iconButton}>
                    <Image source={emojiIcon} style={styles.iconMenu} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Image source={stickerIcon} style={styles.iconMenu} />
                </TouchableOpacity>
            </View>

            {/* 채팅방 생성 버튼 */}
            <TouchableOpacity style={styles.createButton} onPress={() => Alert.alert('채팅방 생성')}>
                <Image source={createIcon} style={styles.createIcon} />
            </TouchableOpacity>
        </View>
    );
};

// 스타일 정의
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    searchContainer: { marginBottom: 10 },
    searchInput: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10 },
    filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
    filterText: { fontSize: 16, color: '#999' },
    activeFilter: { fontSize: 16, fontWeight: 'bold', color: '#6200ee' },
    chatRoomContainer: { paddingVertical: 10 },
    chatRoomItem: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f9f9f9', borderRadius: 10 },
    icon: { width: 40, height: 40, marginRight: 10 },
    chatRoomInfo: { flex: 1 },
    chatRoomName: { fontSize: 18, fontWeight: 'bold' },
    chatRoomLastMessage: { fontSize: 14, color: '#666' },
    unreadBadge: { backgroundColor: '#f00', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
    unreadText: { color: '#fff' },
    mediaPreview: { width: 50, height: 50, borderRadius: 5 },
    iconAction: { width: 20, height: 20, marginLeft: 10 },
    bottomMenu: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: '#fff' },
    iconButton: { padding: 10 },
    iconMenu: { width: 30, height: 30 },
    createButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#6200ee',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
    },
    createIcon: { width: 24, height: 24, tintColor: '#fff' },
});

export default ChatMainScreen;
