import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TrainerProfileScreen from '../screens/TrainerProfileScreen';
import TrainerDashboardScreen from '../screens/TrainerDashboardScreen';
import AddPackageScreen from '../screens/AddPackageScreen';
import ChooseRoleScreen from '../screens/ChooseRoleScreen';
import RegisterClientScreen from '../screens/RegisterClientScreen';
import RegisterTrainerScreen from '../screens/RegisterTrainerScreen';
import AddTraining from '../screens/AddTrainingScreen.tsx';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated, user} = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
      } catch (error) {
        console.error('❌ Greška pri učitavanju tokena:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {loading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : isAuthenticated ? (
          user?.role === 'trainer' ? (
            <>
              <Stack.Screen
                name="TrainerDashboard"
                component={TrainerDashboardScreen}
              />
              <Stack.Screen name="AddTraining" component={AddTraining} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="TrainerProfile"
                component={TrainerProfileScreen}
              />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="AddPackage" component={AddPackageScreen} />
            <Stack.Screen name="ChooseRole" component={ChooseRoleScreen} />
            <Stack.Screen
              name="RegisterClient"
              component={RegisterClientScreen}
            />
            <Stack.Screen
              name="RegisterTrainer"
              component={RegisterTrainerScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
