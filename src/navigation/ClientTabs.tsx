import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TrainerListScreen from '../screens/client/TrainerListScreen.tsx';
import HomeFeedScreen from '../screens/client/HomeFeedScreen.tsx';
import FavoritesScreen from '../screens/client/FavoritesScreen.tsx';
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
        tabBarIcon: ({color, focused}) => {
          let iconName: string;

          if (route.name === 'HomeFeed') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'TrainerList') {
            iconName = focused ? 'people' : 'people-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Icon name={iconName} size={22} color={color} />;
        },
      })}>
      <Tab.Screen
        name="HomeFeed"
        component={HomeFeedScreen}
        options={{tabBarLabel: 'Početna'}}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen} // Napravi ovaj ekran
        options={{
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'star' : 'star-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TrainerList"
        component={TrainerListScreen}
        options={{tabBarLabel: 'Treneri'}}
      />
    </Tab.Navigator>
  );
};

export default ClientTabs;
