// MainPage.js
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChatMainScreen = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('사용자'); // 사용자 이름 상태

    const handleFriendAdd = () => {
        Alert.prompt('친구 추가', '친구 ID를 입력하세요.', async (friendId) => {
            // 친구 추가 로직
            try {
                await axios.post('https://your-server-api/friends/add', { friendId });
                Alert.alert('친구가 추가되었습니다!');
            } catch (error) {
                Alert.alert('추가 실패', '친구 추가에 실패했습니다.');
            }
        });
    };

    const handleInviteLink = () => {
        Alert.alert('초대 링크 생성됨', '링크가 복사되었습니다.');
    };

    const handleDataSavingMode = async () => {
        try {
            await AsyncStorage.setItem('dataSavingMode', 'enabled');
            Alert.alert('데이터 절약 모드 활성화');
        } catch (e) {
            Alert.alert('에러 발생');
        }
    };

    return (
        <View>
            <Text>안녕하세요, {userName}님!</Text>
            <Button title="친구 추가" onPress={handleFriendAdd} />
            <Button title="초대 링크 생성" onPress={handleInviteLink} />
            <Button title="데이터 절약 모드 활성화" onPress={handleDataSavingMode} />
        </View>
    );
};

export default ChatMainScreen;
