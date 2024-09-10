import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';

// 각 스크린 파일들을 import 합니다.
import FirstScreen from './screens/FirstScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import FindAccountScreen from './screens/FindAccountScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import StudyScreen from './screens/StudyScreen';
import GroupScreen from './screens/GroupScreen';
import MyPageScreen from './screens/MyPageScreen';

// Stack Navigator와 Bottom Tab Navigator 생성
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator 구성: 홈, 채팅, 나의 공부, 그룹, 마이페이지
const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Chat') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'Study') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'Group') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'MyPage') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
            <Tab.Screen name="Chat" component={ChatScreen} options={{ title: '채팅' }} />
            <Tab.Screen name="Study" component={StudyScreen} options={{ title: '나의 공부' }} />
            <Tab.Screen name="Group" component={GroupScreen} options={{ title: '그룹' }} />
            <Tab.Screen name="MyPage" component={MyPageScreen} options={{ title: '마이페이지' }} />
        </Tab.Navigator>
    );
};

// Stack Navigator 설정
const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="FirstScreen"
                screenOptions={{
                    headerShown: false, // 헤더를 숨겨서 전체 화면을 깔끔하게
                }}
            >
                {/* 앱의 첫 화면으로 설정된 FirstScreen */}
                <Stack.Screen name="FirstScreen" component={FirstScreen} />
                {/* 로그인 화면 */}
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                {/* 회원가입 화면 */}
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                {/* 아이디/비밀번호 찾기 화면 */}
                <Stack.Screen name="FindAccountScreen" component={FindAccountScreen} />
                {/* 비밀번호 재설정 화면 */}
                <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
                {/* 로그인 후에 보여줄 Bottom Tab Navigator */}
                <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
