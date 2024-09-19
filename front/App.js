// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

// 스크린 파일들 불러오기
import FirstScreen from './screens/FirstScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import HomeScreen from './screens/Home/HomeScreen';
import ChatMainScreen from './screens/Chat/ChatMainScreen';
import ChatSettingsScreen from './screens/Chat/ChatSettingsScreen';
import FileHubScreen from './screens/Chat/FileHubScreen';
import NotificationScreen from './screens/Chat/NotificationScreen';
import TaskScreen from './screens/Chat/TaskScreen';
import ThreadReplyScreen from './screens/Chat/ThreadReplyScreen';
import UserControlDashboardScreen from './screens/Chat/UserControlDashboardScreen';
import GroupScreen from './screens/Group/GroupScreen';
import MyStudyScreen from './screens/MyStudy/MyStudyScreen';
import MyPageScreen from './screens/MyPage/MyPageScreen';

// 네비게이션 생성
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 메인 앱 컴포넌트
const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="FirstScreen" screenOptions={{ headerShown: false }}>
                {/* 초기 화면 */}
                <Stack.Screen name="FirstScreen" component={FirstScreen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                {/* 로그인 성공 후 메인 탭 네비게이션 */}
                <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

// 하단 탭 네비게이션 설정
const MainTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Chat') {
                        iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                    } else if (route.name === 'My Study') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'Group') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'My Page') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Chat" component={ChatStack} options={{ headerShown: false }} />
            <Tab.Screen name="My Study" component={MyStudyScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Group" component={GroupScreen} options={{ headerShown: false }} />
            <Tab.Screen name="My Page" component={MyPageScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

// 채팅 관련 스크린을 스택 네비게이션으로 관리
const ChatStack = () => {
    return (
        <Stack.Navigator initialRouteName="ChatMainScreen">
            <Stack.Screen name="ChatMainScreen" component={ChatMainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatSettingsScreen" component={ChatSettingsScreen} />
            <Stack.Screen name="FileHubScreen" component={FileHubScreen} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
            <Stack.Screen name="TaskScreen" component={TaskScreen} />
            <Stack.Screen name="ThreadReplyScreen" component={ThreadReplyScreen} />
            <Stack.Screen name="UserControlDashboardScreen" component={UserControlDashboardScreen} />
        </Stack.Navigator>
    );
};

export default App;
