import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../store/auth/authSlice';
import {RootState} from '../store/store';
import {useNavigation} from '@react-navigation/native'; // ✅ Ispravan import

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // ✅ Dodato

  const {user} = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser() as any); // ⏳ Sačekaj da Redux resetuje stanje
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <View style={styles.container}>
      <Text>Dobrodošao, {user?.name || 'Korisniče'}!</Text>
      <Button title="Odjavi se" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    width: 200,
  },
});
