import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../../store/auth/authSlice.ts';
import {RootState} from '../../store/store.ts';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {loading, error, isAuthenticated, user} = useSelector(
    (state: RootState) => state.auth,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [
          {name: user.role == 'client' ? 'ClientTabs' : 'TrainerDashboard'},
        ],
      });
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = () => {
    dispatch(loginUser({email, password}) as any);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#d8f24e" />
      </TouchableOpacity>
      <Text style={styles.title}>Prijavi se</Text>
      <Text style={styles.welcome}>Dobrodošli</Text>
      <Text style={styles.description}>
        Svaki cilj počinje prvim korakom. Započni svoj put ka uspeh.
      </Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@example.com"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={[styles.label, {marginTop: 15}]}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="************"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Zaboravili ste lozinku?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Prijavi se</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>ili se prijavi sa</Text>
      <View style={styles.iconRow}>
        <FontAwesome name="google" size={28} color="#fff" style={styles.icon} />
        <FontAwesome
          name="facebook"
          size={28}
          color="#fff"
          style={styles.icon}
        />
        <Ionicons
          name="finger-print"
          size={28}
          color="#fff"
          style={styles.icon}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ChooseRole')}>
        <Text style={styles.signupText}>
          Nemate nalog? <Text style={styles.signupLink}>Registruj se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 24,
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
    marginBottom: 15,
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
  forgot: {
    color: '#4c0070',
    fontWeight: '500',
    fontSize: 14,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  loginButton: {
    width: width - 120,
    backgroundColor: '#1b1a1a',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontWeight: '500',
  },
  orText: {
    color: '#ccc',
    marginBottom: 12,
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  icon: {
    marginHorizontal: 12,
  },
  signupText: {
    color: '#ccc',
    fontSize: 14,
  },
  signupLink: {
    color: '#d8f24e',
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 105,
    left: 20,
    zIndex: 10,
  },
});
