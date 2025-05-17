import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/client/HomeScreen';
import ClientProfileScreen from '../screens/client/ClientProfileScreen';
import SettingsScreen from '../screens/client/SettingsScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const ClientTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#d8f24e',
          height: 70,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 6,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarActiveTintColor: '#1b1a1a',
        tabBarInactiveTintColor: '#333',
        tabBarIcon: ({color, size}) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Profile') iconName = 'person-outline';
          if (route.name === 'Settings') iconName = 'settings-outline';
          return <Icon name={iconName} size={22} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ClientProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default ClientTabs;
