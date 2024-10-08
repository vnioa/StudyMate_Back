// screens/myStudy/ScheduleManagementScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Modal, Portal, Button, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const ScheduleManagementScreen = () => {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    useEffect(() => {
        if (selectedDate) {
            fetchSchedules();
        }
    }, [selectedDate]);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get(`http://121.127.165.43:3000/api/schedules?startDate=${selectedDate}&endDate=${selectedDate}`);
            setSchedules(response.data.schedules);
        } catch (error) {
            console.error('일정 조회 오류:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const scheduleData = {
                title,
                description,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            };

            if (currentSchedule) {
                await axios.put(`http://121.127.165.43:3000/api/schedules`, { ...scheduleData, scheduleId: currentSchedule.id });
            } else {
                await axios.post(`http://121.127.165.43:3000/api/schedules`, scheduleData);
            }
            setModalVisible(false);
            setCurrentSchedule(null);
            clearForm();
            fetchSchedules();
        } catch (error) {
            console.error('일정 저장 오류:', error);
        }
    };

    const handleDelete = async (scheduleId) => {
        try {
            await axios.delete(`http://121.127.165.43:3000/api/schedules/${scheduleId}`);
            fetchSchedules();
        } catch (error) {
            console.error('일정 삭제 오류:', error);
        }
    };

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setStartTime(new Date());
        setEndTime(new Date());
    };

    const renderScheduleItem = ({ item }) => (
        <View style={styles.scheduleItem}>
            <Text style={styles.scheduleTitle}>{item.title}</Text>
            <Text>{new Date(item.start_time).toLocaleTimeString()} - {new Date(item.end_time).toLocaleTimeString()}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => {
                    setCurrentSchedule(item);
                    setTitle(item.title);
                    setDescription(item.description);
                    setStartTime(new Date(item.start_time));
                    setEndTime(new Date(item.end_time));
                    setModalVisible(true);
                }}>
                    <Text style={styles.editButton}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={styles.deleteButton}>삭제</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: 'blue' }
                }}
            />
            <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.addButton}>
                일정 추가
            </Button>
            <FlatList
                data={schedules}
                renderItem={renderScheduleItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <TextInput
                            label="제목"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                        />
                        <TextInput
                            label="설명"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            style={styles.input}
                        />
                        <Text>시작 시간:</Text>
                        <DateTimePicker
                            value={startTime}
                            mode="datetime"
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedDate) => setStartTime(selectedDate || startTime)}
                        />
                        <Text>종료 시간:</Text>
                        <DateTimePicker
                            value={endTime}
                            mode="datetime"
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedDate) => setEndTime(selectedDate || endTime)}
                        />
                        <Button mode="contained" onPress={handleSubmit}>
                            {currentSchedule ? '수정' : '추가'}
                        </Button>
                        <Button mode="outlined" onPress={() => {
                            setModalVisible(false);
                            setCurrentSchedule(null);
                            clearForm();
                        }}>
                            취소
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scheduleItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    scheduleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    editButton: {
        color: 'blue',
        marginRight: 10,
    },
    deleteButton: {
        color: 'red',
    },
    addButton: {
        marginVertical: 10,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    input: {
        marginBottom: 10,
    },
});

export default ScheduleManagementScreen;