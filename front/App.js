import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';

// 각종 스크린 import
import FirstScreen from './screens/FirstScreen';
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ChattingScreen from './screens/ChattingScreen';
import MyGroupScreen from './screens/MyGroupScreen';
import MyPageScreen from './screens/MyPageScreen';

// 나의 공부 관련 스크린 import
import StudyGoalScreen from './screens/StudyGoalScreen';
import StudyChecklistScreen from './screens/StudyChecklistScreen';
import StudyTimerScreen from './screens/StudyTimerScreen';
import StudyReminderScreen from './screens/StudyReminderScreen';
import StudyMaterialScreen from './screens/StudyMaterialScreen';
import StudyPatternAnalysisScreen from './screens/StudyPatternAnalysisScreen';
import StudyReportScreen from './screens/StudyReportScreen';
import StudyNoteScreen from './screens/StudyNoteScreen';

// 기타 이미지 파일 import
import homeIcon from './assets/home.png';
import chattingIcon from './assets/chattingList.png';
import myStudyIcon from './assets/open-book.png';
import myPageIcon from './assets/id-card.png';
import groupIcon from './assets/meeting.png';

const Tab = createBottomTabNavigator();
const StudyStack = createStackNavigator();
const AuthStack = createStackNavigator();

// "나의 공부" 스택 네비게이션 구성
const StudyStackNavigator = () => {
    return (
        <StudyStack.Navigator initialRouteName="StudyGoalScreen">
            <StudyStack.Screen name="StudyGoalScreen" component={StudyGoalScreen} />
            <StudyStack.Screen name="StudyChecklistScreen" component={StudyChecklistScreen} />
            <StudyStack.Screen name="StudyTimerScreen" component={StudyTimerScreen} />
            <StudyStack.Screen name="StudyReminderScreen" component={StudyReminderScreen} />
            <StudyStack.Screen name="StudyMaterialScreen" component={StudyMaterialScreen} />
            <StudyStack.Screen name="StudyPatternAnalysisScreen" component={StudyPatternAnalysisScreen} />
            <StudyStack.Screen name="StudyReportScreen" component={StudyReportScreen} />
            <StudyStack.Screen name="StudyNoteScreen" component={StudyNoteScreen} />
        </StudyStack.Navigator>
    );
};

// 탭 네비게이션 구성
const TabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: '홈',
                    tabBarIcon: ({ color, size }) => (
                        <Image source={homeIcon} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Chatting"
                component={ChattingScreen}
                options={{
                    tabBarLabel: '채팅방',
                    tabBarIcon: ({ color, size }) => (
                        <Image source={chattingIcon} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Study"
                component={StudyStackNavigator}
                options={{
                    tabBarLabel: '나의 공부',
                    tabBarIcon: ({ color, size }) => (
                        <Image source={myStudyIcon} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }}
            />
            <Tab.Screen
                name="MyGroup"
                component={MyGroupScreen}
                options={{
                    tabBarLabel: '나의 그룹',
                    tabBarIcon: ({ color, size }) => (
                        <Image source={groupIcon} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }}
            />
            <Tab.Screen
                name="MyPage"
                component={MyPageScreen}
                options={{
                    tabBarLabel: '마이페이지',
                    tabBarIcon: ({ color, size }) => (
                        <Image source={myPageIcon} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

// 로그인 흐름을 관리하는 스택 네비게이션
const AuthStackNavigator = () => {
    return (
        <AuthStack.Navigator initialRouteName="FirstScreen">
            <AuthStack.Screen name="FirstScreen" component={FirstScreen} options={{ headerShown: false }} />
            <AuthStack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
            <AuthStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <AuthStack.Screen name="HomeScreen" component={TabNavigator} options={{ headerShown: false }} />
        </AuthStack.Navigator>
    );
};

// App 메인 구성
export default function App() {
    return (
        <NavigationContainer>
            <AuthStackNavigator />
        </NavigationContainer>
    );
}
