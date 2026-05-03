import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

import HomeScreen from '../screens/home/HomeScreen';
import MyCoursesScreen from '../screens/courses/MyCoursesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  const iconMap = {
    Home: focused ? 'home' : 'home-outline',
    MyCourses: focused ? 'book' : 'book-outline',
    Profile: focused ? 'person' : 'person-outline',
  };
  const labels = {
    Home: 'Главная',
    MyCourses: 'Мои курсы',
    Profile: 'Профиль',
  };
  return (
    <View style={styles.tabIconWrap}>
      <Ionicons
        name={iconMap[name]}
        size={24}
        color={focused ? '#6C5CE7' : '#B2BEC3'}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
        {labels[name]}
      </Text>
    </View>
  );
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#F0F1F8',
        borderTopWidth: 1,
        height: 70,
        paddingBottom: 8,
        paddingTop: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      tabBarActiveTintColor: '#6C5CE7',
      tabBarInactiveTintColor: '#B2BEC3',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="MyCourses" component={MyCoursesScreen} options={{ title: 'Мои курсы' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    color: '#B2BEC3',
    marginTop: 2,
  },
  tabLabelFocused: {
    color: '#6C5CE7',
    fontWeight: '700',
  },
});

export default TabNavigator;
