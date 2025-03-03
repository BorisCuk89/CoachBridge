import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Alert, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });
      await AsyncStorage.setItem('token', res.data.token);
      Alert.alert('Uspešna prijava!');
      navigation.replace('Home'); // Preusmeravanje na HomeScreen
    } catch (err) {
      Alert.alert('Greška', err.response?.data?.msg || 'Došlo je do greške.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <View style={{padding: 20, width: 350}}>
        <Text>Email:</Text>
        <TextInput
          style={{borderWidth: 1, padding: 8, marginBottom: 10}}
          value={email}
          onChangeText={setEmail}
        />

        <Text>Lozinka:</Text>
        <TextInput
          style={{borderWidth: 1, padding: 8, marginBottom: 10}}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Prijavi se" onPress={handleLogin} />
      </View>
      <Button title="Go to Home" onPress={() => navigation.replace('Home')} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
