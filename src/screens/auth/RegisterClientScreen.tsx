import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {registerClient} from '../../store/auth/authSlice.ts';
import {useDispatch} from 'react-redux';

const RegisterClientScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const resultAction = await dispatch(
      registerClient({
        name,
        email,
        password,
        role: 'client',
      }) as any,
    );

    if (registerClient.fulfilled.match(resultAction)) {
      Alert.alert('Uspeh', 'Klijent uspešno registrovan!');
      navigation.replace('Home');
    } else {
      Alert.alert('Greška', resultAction.payload || 'Došlo je do greške.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registracija Klijenta</Text>
      <TextInput
        placeholder="Ime"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Lozinka"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Registruj se</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterClientScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
  input: {
    width: 250,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});
