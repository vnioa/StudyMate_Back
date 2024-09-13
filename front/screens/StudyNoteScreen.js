import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const StudyNoteScreen = () => {
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState([]);

    // 노트 저장
    const saveNote = async () => {
        if (!note) {
            Alert.alert('노트를 입력해 주세요.');
            return;
        }
        try {
            await axios.post(`${process.env.API_URL}/save-note`, { note });
            setNotes([...notes, note]);
            setNote('');
            Alert.alert('노트가 저장되었습니다.');
        } catch (error) {
            console.error('노트 저장 중 오류가 발생했습니다:', error);
        }
    };

    // 노트 목록 렌더링
    const renderNoteItem = ({ item }) => (
        <View style={styles.noteItem}>
            <Text>{item}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>학습 노트 관리</Text>

            <TextInput
                style={styles.textInput}
                placeholder="노트를 작성하세요"
                value={note}
                onChangeText={setNote}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
                <Text style={styles.buttonText}>노트 저장</Text>
            </TouchableOpacity>

            <FlatList
                data={notes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderNoteItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    textInput: {
        height: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    saveButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    noteItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
});

export default StudyNoteScreen;
