import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
// Auth Screen
import SplashScreen from '../screens/auth/SplashScreen.tsx';
import WelcomeScreen from '../screens/auth/WelcomeScreen.tsx';
import LoginScreen from '../screens/auth/LoginScreen.tsx';
import ChooseRoleScreen from '../screens/auth/ChooseRoleScreen.tsx';
import RegisterClientScreen from '../screens/auth/RegisterClientScreen.tsx';
import RegisterTrainerScreen from '../screens/auth/RegisterTrainerScreen.tsx';
// Client Screen
import HomeScreen from '../screens/client/HomeScreen.tsx';
import TrainerProfileScreen from '../screens/client/TrainerProfileScreen.tsx';
import TrainerPackageDetails from '../screens/client/TrainerPackageDetailsScreen.tsx';
import MealPlanDetails from '../screens/client/MealPlanDetailsScreen.tsx';
import ClientProfileScreen from '../screens/client/ClientProfileScreen';
// Trainer Screen
import TrainerDashboardScreen from '../screens/trainer/TrainerDashboardScreen.tsx';
import AddPackageScreen from '../screens/trainer/AddPackageScreen.tsx';
import AddTraining from '../screens/trainer/AddTrainingScreen.tsx';
import AddMealPlanScreen from '../screens/trainer/AddMealPlanScreen.tsx';
import TrainerWallet from '../screens/trainer/TrainerWalletScreen.tsx';

import ClientTabs from '../navigation/ClientTabs.tsx';

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
        ) : (
          <>
            {isAuthenticated ? (
              user?.role === 'trainer' ? (
                <>
                  <Stack.Screen
                    name="TrainerDashboard"
                    component={TrainerDashboardScreen}
                  />
                  <Stack.Screen name="AddTraining" component={AddTraining} />
                  <Stack.Screen
                    name="AddMealPlan"
                    component={AddMealPlanScreen}
                  />
                  <Stack.Screen
                    name="TrainerWallet"
                    component={TrainerWallet}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen name="ClientTabs" component={ClientTabs} />
                  {/*<Stack.Screen name="Home" component={HomeScreen} />*/}
                  <Stack.Screen
                    name="TrainerProfile"
                    component={TrainerProfileScreen}
                  />
                  <Stack.Screen
                    name="TrainerPackageDetails"
                    component={TrainerPackageDetails}
                  />
                  <Stack.Screen
                    name="MealPlanDetails"
                    component={MealPlanDetails}
                  />
                  <Stack.Screen
                    name="ClientProfile"
                    component={ClientProfileScreen}
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
