import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';

const SharedMediaScreen = ({ route }) => {
    const { chatRoomId } = route.params;
    const [media, setMedia] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchSharedMedia();
    }, []);

    const fetchSharedMedia = async () => {
        try {
            const response = await axios.get(`http://121.127.165.43:3000/api/chat/${chatRoomId}/shared-media`);
            setMedia(response.data.media);
        } catch (error) {
            console.error('공유 미디어 조회 오류:', error);
        }
    };

    const onChangeSearch = query => setSearchQuery(query);

    const filteredMedia = media.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderMediaItem = ({ item }) => (
        <TouchableOpacity style={styles.mediaItem} onPress={() => handleMediaPress(item)}>
            {item.type.startsWith('image') ? (
                <Image source={{ uri: item.url }} style={styles.mediaImage} />
            ) : (
                <View style={styles.fileIcon}>
                    <Text>{item.type.split('/')[1].toUpperCase()}</Text>
                </View>
            )}
            <Text style={styles.mediaName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const handleMediaPress = (item) => {
        // 여기에 미디어 열기 또는 다운로드 로직 구현
        console.log('Selected media:', item);
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="검색"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={styles.searchBar}
            />
            <FlatList
                data={filteredMedia}
                renderItem={renderMediaItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    searchBar: {
        marginBottom: 10,
    },
    mediaItem: {
        flex: 1/3,
        aspectRatio: 1,
        margin: 5,
        alignItems: 'center',
    },
    mediaImage: {
        width: '100%',
        height: '80%',
        borderRadius: 5,
    },
    fileIcon: {
        width: '100%',
        height: '80%',
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    mediaName: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
    },
});

export default SharedMediaScreen;