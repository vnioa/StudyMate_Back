import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

const MediaGalleryScreen = () => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [filteredMediaFiles, setFilteredMediaFiles] = useState([]);
    const [activeTab, setActiveTab] = useState('all'); // all, images, videos, files
    const isFocused = useIsFocused();

    // 서버에서 미디어 파일을 가져오는 함수
    const fetchMediaFiles = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/media`);
            if (response.data) {
                setMediaFiles(response.data);
                setFilteredMediaFiles(response.data); // 초기에는 모든 파일을 표시
            }
        } catch (error) {
            console.error('미디어 파일을 불러오는 중 오류 발생:', error);
        }
    };

    // 필터링 로직
    const filterMedia = (type) => {
        if (type === 'all') {
            setFilteredMediaFiles(mediaFiles);
        } else {
            const filtered = mediaFiles.filter((file) => file.type === type);
            setFilteredMediaFiles(filtered);
        }
        setActiveTab(type);
    };

    useEffect(() => {
        if (isFocused) {
            fetchMediaFiles();
        }
    }, [isFocused]);

    // 미디어 파일 렌더링
    const renderMediaItem = ({ item }) => (
        <TouchableOpacity style={styles.mediaItem}>
            {item.type === 'image' ? (
                <Image source={{ uri: item.url }} style={styles.mediaImage} />
            ) : (
                <View style={styles.mediaFile}>
                    <Text>{item.fileName}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* 상단 탭 */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'all' && styles.activeTab]}
                    onPress={() => filterMedia('all')}
                >
                    <Text style={styles.tabText}>전체</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'image' && styles.activeTab]}
                    onPress={() => filterMedia('image')}
                >
                    <Text style={styles.tabText}>이미지</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'video' && styles.activeTab]}
                    onPress={() => filterMedia('video')}
                >
                    <Text style={styles.tabText}>동영상</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'file' && styles.activeTab]}
                    onPress={() => filterMedia('file')}
                >
                    <Text style={styles.tabText}>파일</Text>
                </TouchableOpacity>
            </View>

            {/* 미디어 파일 리스트 */}
            <FlatList
                data={filteredMediaFiles}
                renderItem={renderMediaItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                style={styles.mediaList}
            />
        </View>
    );
};

// 스타일링
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
    tabs: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    tab: { padding: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: '#6200ee' },
    tabText: { fontSize: 16, color: '#333' },
    mediaList: { flex: 1 },
    mediaItem: { flex: 1, margin: 5 },
    mediaImage: { width: '100%', height: 100, resizeMode: 'cover' },
    mediaFile: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
});

export default MediaGalleryScreen;
