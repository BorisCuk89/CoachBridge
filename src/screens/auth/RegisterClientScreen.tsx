import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {registerClient} from '../../store/auth/authSlice.ts';
import {useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

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
      navigation.replace('ClientTabs');
    } else {
      Alert.alert('Greška', resultAction.payload || 'Došlo je do greške.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Strelica nazad */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#d8f24e" />
      </TouchableOpacity>

      {/* Naslov i opis */}
      <Text style={styles.title}>Registruj se kao klijent</Text>
      <Text style={styles.welcome}>Dobrodošli</Text>
      <Text style={styles.description}>
        Pridruži se zajednici. Započni svoj put ka napretku već danas!
      </Text>

      {/* Forma */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Ime</Text>
        <TextInput
          style={styles.input}
          placeholder="Unesi ime"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.label, {marginTop: 12}]}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@example.com"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={[styles.label, {marginTop: 12}]}>Lozinka</Text>
        <TextInput
          style={styles.input}
          placeholder="***********"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Dugme */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registruj se</Text>
      </TouchableOpacity>

      {/* Link za login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Već imate nalog? <Text style={styles.loginLink}>Prijavi se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterClientScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 105,
    left: 20,
  },
  title: {
    fontSize: 20,
    color: '#d8f24e',
    fontWeight: 'bold',
    marginBottom: 80,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#a58af8',
    padding: 20,
    borderRadius: 16,
    width: width - 48,
    marginBottom: 30,
  },
  label: {
    color: '#1b1a1a',
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: width - 120,
    backgroundColor: '#1b1a1a',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#ccc',
    fontSize: 14,
  },
  loginLink: {
    color: '#d8f24e',
    fontWeight: '600',
  },
});
