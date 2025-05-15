import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const ChooseRoleScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Strelica nazad */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#d8f24e" />
      </TouchableOpacity>

      {/* Naslov */}
      <Text style={styles.title}>Registracija</Text>

      {/* Motivacioni tekst */}
      <Text style={styles.subtitle}>
        Kreiraj nalog kao klijent ili trener i postani deo fitnes zajednice.
      </Text>

      {/* Dugmad */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegisterClient')}>
        <Text style={styles.buttonText}>Registruj se kao Klijent</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegisterTrainer')}>
        <Text style={styles.buttonText}>Registruj se kao Trener</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseRoleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 10,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 28,
    width: width - 48,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#1b1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
