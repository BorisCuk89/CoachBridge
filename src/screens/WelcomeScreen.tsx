import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store/store';

const WelcomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {isAuthenticated, user} = useSelector((state: RootState) => state.auth);
  console.log('isAuthenticate ', isAuthenticated);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CoachBridge</Text>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <Button
        title="Registracija"
        onPress={() => navigation.navigate('ChooseRole')}
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
