import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
// Auth Screen
import SplashScreen from '../screens/auth/SplashScreen.tsx';
import WelcomeScreen from '../screens/auth/WelcomeScreen.tsx';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen.tsx';
import LoginScreen from '../screens/auth/LoginScreen.tsx';
import ChooseRoleScreen from '../screens/auth/ChooseRoleScreen.tsx';
import RegisterClientScreen from '../screens/auth/RegisterClientScreen.tsx';
import RegisterTrainerScreen from '../screens/auth/RegisterTrainerScreen.tsx';
import PasswordChangeScreen from '../screens/auth/PasswordChangeScreen.tsx';
// Client Screen
import PaymentStatusScreen from '../screens/payment/PaymentStatusScreen.tsx';
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

import {Linking} from 'react-native';

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

  const linking = {
    prefixes: ['coachbridge://'],
    config: {
      screens: {
        ClientTabs: {
          screens: {
            Home: 'home',
            ClientProfile: 'profile',
            Settings: 'settings',
          },
        },
        PaymentStatus: 'payment-status',
        TrainerProfile: 'trainer-profile/:trainerId',
        TrainerPackageDetails: 'trainer-package/:packageId',
        MealPlanDetails: 'meal-plan/:mealPlanId',
      },
    },
  };

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('🌐 Initial URL (app opened via deep link):', url);
      } else {
        console.log('🚫 App not opened via deep link');
      }
    });

    const handleDeepLink = ({url}) => {
      console.log('📥 Deep link primljen:', url);
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
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
                  <Stack.Screen
                    name="ChangePassword"
                    component={PasswordChangeScreen}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen name="ClientTabs" component={ClientTabs} />
                  <Stack.Screen
                    name="PaymentStatus"
                    component={PaymentStatusScreen}
                  />
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
                  <Stack.Screen
                    name="ChangePassword"
                    component={PasswordChangeScreen}
                  />
                </>
              )
            ) : (
              <>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
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
