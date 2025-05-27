import React, {useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {store} from './store/store';
import AppNavigator from '../src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadUserFromStorage} from './store/auth/authSlice';
import {LogBox} from 'react-native';
import {loadFavorites} from './store/trainer/trainerSlice';
import {Provider as PaperProvider} from 'react-native-paper';

LogBox.ignoreAllLogs(false);

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFavorites());
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');

        if (token && user) {
          dispatch(loadUserFromStorage({token, user: JSON.parse(user)}));
        }
      } catch (error) {
        console.error(
          '❌ Greška pri učitavanju korisnika iz AsyncStorage-a',
          error,
        );
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
};

export default App;
