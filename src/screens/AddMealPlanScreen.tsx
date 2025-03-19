import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addMealPlan} from '../store/trainer/trainerSlice';
import {RootState} from '../store/store';

const AddMealPlanScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleAddMealPlan = () => {
    if (!title || !description || !price) {
      Alert.alert('Greška', 'Sva polja su obavezna.');
      return;
    }

    dispatch(
      addMealPlan({
        trainerId: user._id,
        title,
        description,
        price: parseFloat(price),
      }) as any,
    ).then(res => {
      if (res.meta.requestStatus === 'fulfilled') {
        Alert.alert('Uspeh', 'Plan ishrane uspešno dodat!');
        navigation.goBack();
      } else {
        Alert.alert('Greška', res.payload);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Naziv plana</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Opis</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Cena (€)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Button title="Dodaj plan" onPress={handleAddMealPlan} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, paddingTop: 100, backgroundColor: '#fff'},
  label: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default AddMealPlanScreen;
