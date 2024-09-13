import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Switch } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';

const StudyReminderScreen = () => {
    const [reminderTime, setReminderTime] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isReviewEnabled, setIsReviewEnabled] = useState(false);

    // 리마인더 시간 설정
    const handleConfirm = (time) => {
        setReminderTime(time);
        setDatePickerVisibility(false);
    };

    // 리마인더 저장
    const saveReminder = async () => {
        if (!reminderTime) {
            Alert.alert('리마인더 시간을 설정해 주세요.');
            return;
        }
        try {
            await axios.post(`${process.env.API_URL}/save-reminder`, { reminderTime });
            Alert.alert('리마인더가 저장되었습니다.');
        } catch (error) {
            console.error('리마인더 저장 중 오류가 발생했습니다:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>학습 리마인더 설정</Text>

            <TouchableOpacity style={styles.timeButton} onPress={() => setDatePickerVisibility(true)}>
                <Text style={styles.buttonText}>
                    {reminderTime ? `리마인더 시간: ${reminderTime.toLocaleTimeString()}` : '리마인더 시간 설정'}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={() => setDatePickerVisibility(false)}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveReminder}>
                <Text style={styles.buttonText}>리마인더 저장</Text>
            </TouchableOpacity>

            <View style={styles.switchContainer}>
                <Text style={styles.label}>AI 복습 계획 설정</Text>
                <Switch value={isReviewEnabled} onValueChange={setIsReviewEnabled} />
            </View>

            {isReviewEnabled && (
                <Text style={styles.aiText}>AI가 복습이 필요한 시기를 분석하여 알림을 설정합니다.</Text>
            )}
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
    timeButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        marginBottom: 20,
    },
    saveButton: {
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    label: {
        fontSize: 18,
        marginRight: 10,
    },
    aiText: {
        marginTop: 20,
        fontSize: 16,
        color: '#757575',
    },
});

export default StudyReminderScreen;
