import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const FriendManagementScreen = () => {
    const [friends, setFriends] = useState([]); // 친구 목록
    const [searchQuery, setSearchQuery] = useState(''); // 검색 쿼리
    const [newFriend, setNewFriend] = useState(''); // 새 친구 추가
    const [blockedFriends, setBlockedFriends] = useState([]); // 차단된 친구 목록

    // 서버에서 친구 목록 가져오기
    const fetchFriends = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/friends`);
            setFriends(response.data || []); // 데이터가 없으면 빈 리스트
        } catch (error) {
            console.error("친구 목록을 불러오는 중 오류 발생:", error);
        }
    };

    // 친구 추가 API 호출
    const addFriend = async () => {
        try {
            const response = await axios.post(`${process.env.API_URL}/friends`, { name: newFriend });
            if (response.status === 201) {
                Alert.alert('성공', '친구가 추가되었습니다.');
                setNewFriend('');
                fetchFriends(); // 목록 업데이트
            }
        } catch (error) {
            console.error("친구 추가 중 오류 발생:", error);
            Alert.alert('오류', '친구 추가에 실패했습니다.');
        }
    };

    // 친구 차단 API 호출
    const blockFriend = async (friendId) => {
        try {
            const response = await axios.post(`${process.env.API_URL}/blockFriend`, { friendId });
            if (response.status === 200) {
                Alert.alert('성공', '친구가 차단되었습니다.');
                fetchFriends(); // 목록 업데이트
                fetchBlockedFriends(); // 차단된 친구 목록 업데이트
            }
        } catch (error) {
            console.error("친구 차단 중 오류 발생:", error);
        }
    };

    // 차단된 친구 목록 가져오기
    const fetchBlockedFriends = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/blockedFriends`);
            setBlockedFriends(response.data || []); // 데이터가 없으면 빈 리스트
        } catch (error) {
            console.error("차단된 친구 목록을 불러오는 중 오류 발생:", error);
        }
    };

    // 검색된 친구 목록 필터링
    const filteredFriends = friends.filter(friend => friend.name.includes(searchQuery));

    useEffect(() => {
        fetchFriends();
        fetchBlockedFriends();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>친구 관리</Text>

            {/* 친구 검색창 */}
            <TextInput
                style={styles.searchInput}
                placeholder="친구 검색"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* 친구 목록 */}
            <FlatList
                data={filteredFriends}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.friendItem}>
                        <Text>{item.name}</Text>
                        <TouchableOpacity onPress={() => blockFriend(item.id)}>
                            <Text style={styles.blockButton}>차단</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* 새 친구 추가 */}
            <View style={styles.addFriendContainer}>
                <TextInput
                    style={styles.newFriendInput}
                    placeholder="친구 추가"
                    value={newFriend}
                    onChangeText={setNewFriend}
                />
                <Button title="추가" onPress={addFriend} />
            </View>

            {/* 차단된 친구 목록 */}
            <Text style={styles.subTitle}>차단된 친구</Text>
            <FlatList
                data={blockedFriends}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.blockedItem}>
                        <Text>{item.name}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    searchInput: { height: 40, borderColor: '#ddd', borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
    friendItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
    blockButton: { color: 'red', fontWeight: 'bold' },
    addFriendContainer: { flexDirection: 'row', marginTop: 20 },
    newFriendInput: { flex: 1, borderColor: '#ddd', borderWidth: 1, padding: 10, marginRight: 10, borderRadius: 5 },
    subTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 30 },
    blockedItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
});

export default FriendManagementScreen;
