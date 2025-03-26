import React, {useEffect, useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../../store/auth/authSlice.ts';
import {RootState} from '../../store/store.ts';
import {useNavigation} from '@react-navigation/native';

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
      console.log('✅ Uspesan login, preusmeravam na Home');
      navigation.reset({
        index: 0,
        routes: [{name: user.role == 'client' ? 'Home' : 'TrainerDashboard'}],
      });
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = async () => {
    console.log('🟢 Pokušaj logina...');
    dispatch(loginUser({email, password}) as any);
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text>Lozinka:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={{color: 'red'}}>{error}</Text>}

      <Button
        title={loading ? 'Prijavljivanje...' : 'Prijavi se'}
        onPress={handleLogin}
        disabled={loading}
      />
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
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    width: 200,
  },
});
