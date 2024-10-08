// PersonalSettings.js
import React, { useState } from 'react';
import { View, Text, Switch, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalSettings = () => {
    const [notifications, setNotifications] = useState(true);
    const [privacyMode, setPrivacyMode] = useState(false);

    const toggleNotifications = async () => {
        setNotifications(!notifications);
        await AsyncStorage.setItem('notifications', notifications ? 'enabled' : 'disabled');
    };

    const togglePrivacyMode = async () => {
        setPrivacyMode(!privacyMode);
        await AsyncStorage.setItem('privacyMode', privacyMode ? 'enabled' : 'disabled');
        Alert.alert('프라이버시 모드', privacyMode ? '비활성화됨' : '활성화됨');
    };

    return (
        <View>
            <Text>알림 설정</Text>
            <Switch value={notifications} onValueChange={toggleNotifications} />
            <Text>프라이버시 모드</Text>
            <Switch value={privacyMode} onValueChange={togglePrivacyMode} />
        </View>
    );
};

export default PersonalSettings;
