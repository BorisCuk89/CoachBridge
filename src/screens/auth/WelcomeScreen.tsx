import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/store.ts';

const WelcomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {isAuthenticated, user} = useSelector((state: RootState) => state.auth);
  console.log('isAuthenticate ', isAuthenticated);
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.jpg')} style={styles.logo} />

      <Text style={styles.title}>Welcome to CoachBridge</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={() => navigation.navigate('ChooseRole')}>
        <Text style={[styles.buttonText, styles.registerButtonText]}>
          Registracija
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1a1a',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    width: 250,
  },
  button: {
    backgroundColor: '#e2f069',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#1b1a1a',
    borderColor: '#fff',
    borderStyle: 'solid',
    borderWidth: '2',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButtonText: {
    color: '#fff',
  },
});
