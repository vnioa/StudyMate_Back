import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';

const FriendListScreen = ({ navigation }) => {
    const [friends, setFriends] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await axios.get('http://121.127.165.43:3000/api/friends');
            setFriends(response.data.friends);
        } catch (error) {
            console.error('친구 목록 조회 오류:', error);
        }
    };

    const renderFriendItem = ({ item }) => (
        <TouchableOpacity
            style={styles.friendItem}
            onPress={() => navigation.navigate('FriendProfile', { friendId: item.id })}
        >
            <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
            <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.name}</Text>
                <Text style={styles.statusMessage}>{item.statusMessage}</Text>
            </View>
        </TouchableOpacity>
    );

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="친구 검색"
                onChangeText={setSearch}
                value={search}
                containerStyle={styles.searchBarContainer}
                inputContainerStyle={styles.searchBarInputContainer}
            />
            <FlatList
                data={filteredFriends}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity
                style={styles.addFriendButton}
                onPress={() => navigation.navigate('AddFriend')}
            >
                <Text style={styles.addFriendButtonText}>친구 추가</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    searchBarContainer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    searchBarInputContainer: {
        backgroundColor: '#FFFFFF',
    },
    friendItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    friendInfo: {
        justifyContent: 'center',
    },
    friendName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusMessage: {
        fontSize: 14,
        color: '#757575',
        marginTop: 5,
    },
    addFriendButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    addFriendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FriendListScreen;