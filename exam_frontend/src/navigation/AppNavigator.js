import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

import TabNavigator from './TabNavigator';
import PhoneScreen from '../screens/auth/PhoneScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import CourseListScreen from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import LessonDetailScreen from '../screens/courses/LessonDetailScreen';
import QuizScreen from '../screens/quiz/QuizScreen';
import LeaderboardScreen from '../screens/profile/LeaderboardScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import ResumeScreen from '../screens/resume/ResumeScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Phone" component={PhoneScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: Colors.background },
    }}
  >
    <Stack.Screen name="MainTabs" component={TabNavigator} />
    <Stack.Screen name="CourseList" component={CourseListScreen} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
    <Stack.Screen name="Quiz" component={QuizScreen} />
    <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Resume" component={ResumeScreen} />
    <Stack.Screen name="MyCourses" component={TabNavigator} />
  </Stack.Navigator>
);

const LoadingScreen = () => (
  <View style={styles.loadingBg}>
    <Text style={styles.loadingEmoji}>🎓</Text>
    <Text style={styles.loadingText}>Omuz</Text>
    <ActivityIndicator color="#6C5CE7" size="large" style={{ marginTop: 20 }} />
  </View>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return isAuthenticated ? <MainStack /> : <AuthStack />;
};

const styles = StyleSheet.create({
  loadingBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FE',
  },
  loadingEmoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#6C5CE7',
    letterSpacing: 3,
  },
});

export default AppNavigator;
