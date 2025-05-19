import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleReset = () => {
    if (!email) {
      Alert.alert('Unesite email adresu');
      return;
    }

    // TODO: Pozvati backend logiku za reset lozinke
    Alert.alert(
      'Provera emaila',
      `Ako postoji nalog sa email adresom ${email}, poslat je link za reset.`,
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#d4ff00" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Zaboravljena lozinka</Text>
      </View>

      {/* Sadržaj */}
      <View style={styles.box}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Unesite email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Pošalji link za reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  header: {
    marginBottom: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4ff00',
    textAlign: 'center',
  },
  box: {
    backgroundColor: '#a78bfa',
    borderRadius: 20,
    padding: 20,
  },
  label: {
    color: '#111',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 105,
    left: 20,
    zIndex: 10,
  },
});
