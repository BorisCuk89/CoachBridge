import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/client/HomeScreen';
import ClientProfileScreen from '../screens/client/ClientProfileScreen';
import SettingsScreen from '../screens/client/SettingsScreen'; // možeš kasnije napraviti
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const ClientTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Profile') iconName = 'person-outline';
          if (route.name === 'Settings') iconName = 'settings-outline';

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ClientProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default ClientTabs;
