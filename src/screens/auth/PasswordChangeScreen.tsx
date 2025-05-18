import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  updatePassword,
  resetPasswordChangeStatus,
} from '../../store/auth/authSlice.ts';
import {RootState} from '../../store/store.ts';

const PasswordChangeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {passwordChangeStatus, passwordChangeError} = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(resetPasswordChangeStatus());
  }, []);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Greška', 'Popunite sva polja.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Greška', 'Nova lozinka mora imati najmanje 6 karaktera.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Greška', 'Nova lozinka se ne poklapa.');
      return;
    }

    try {
      const result = await dispatch(
        updatePassword({
          currentPassword,
          newPassword,
        }) as any,
      );

      if (updatePassword.fulfilled.match(result)) {
        Alert.alert('Uspeh', 'Lozinka je uspešno promenjena!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        navigation.goBack();
      } else {
        Alert.alert('Greška', result.payload || 'Došlo je do greške.');
      }
    } catch (err) {
      Alert.alert('Greška', 'Nešto je pošlo po zlu.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Strelica za nazad */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#d8f24e" />
      </TouchableOpacity>

      {/* Naslov */}
      <Text style={styles.screenTitle}>Promena lozinke</Text>

      {/* Forma */}
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Trenutna lozinka"
          secureTextEntry
          placeholderTextColor="#888"
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          placeholder="Nova lozinka"
          secureTextEntry
          placeholderTextColor="#888"
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          placeholder="Potvrdi novu lozinku"
          secureTextEntry
          placeholderTextColor="#888"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Dugme */}
      <TouchableOpacity
        style={styles.button}
        onPress={handlePasswordChange}
        disabled={passwordChangeStatus === 'loading'}>
        {passwordChangeStatus === 'loading' ? (
          <ActivityIndicator color="#1b1a1a" />
        ) : (
          <Text style={styles.buttonText}>Sačuvaj</Text>
        )}
      </TouchableOpacity>

      {passwordChangeStatus === 'error' && passwordChangeError && (
        <Text style={styles.errorText}>{passwordChangeError}</Text>
      )}
    </View>
  );
};

export default PasswordChangeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  backButton: {
    position: 'absolute',
    top: 105,
    left: 20,
  },
  screenTitle: {
    fontSize: 20,
    color: '#d8f24e',
    fontWeight: 'bold',
    marginBottom: 80,
    textAlign: 'center',
  },
  formContainer: {
    gap: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#d8f24e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#1b1a1a',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});
