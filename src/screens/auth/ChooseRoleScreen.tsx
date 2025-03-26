import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const ChooseRoleScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registracija</Text>
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
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 250,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});
