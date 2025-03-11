import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';

const API_URL = 'http://localhost:5001/api/trainers';

const AddPackageScreen = ({route, navigation}) => {
  const {trainer} = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleAddPackage = async () => {
    if (!title || !description || !price) {
      Alert.alert('Greška', 'Sva polja su obavezna.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${trainer._id}/packages`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, description, price}),
      });

      if (!response.ok) {
        throw new Error('Neuspešno dodavanje paketa');
      }

      Alert.alert('Uspešno', 'Paket dodat!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Greška', 'Došlo je do problema pri dodavanju paketa.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Naziv paketa</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Opis</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Cena (€)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Button title="Dodaj Paket" onPress={handleAddPackage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
});

export default AddPackageScreen;
