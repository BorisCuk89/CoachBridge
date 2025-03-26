import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import {useDispatch} from 'react-redux';
import TrainerCard from '../../components/TrainerCard.tsx';
import {logoutUser} from '../../store/auth/authSlice.ts';
import {useNavigation} from '@react-navigation/native';

const API_URL = 'http://localhost:5001/api/trainers';

const HomeScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await dispatch(logoutUser() as any); // ⏳ Sačekaj da Redux resetuje stanje
    navigation.reset({
      index: 0,
      routes: [{name: 'Welcome'}],
    });
  };

  useEffect(() => {
    fetchTrainers();
  }, [search]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?search=${search}`);
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error('❌ Greška pri dohvatanju trenera', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Pretraži trenere..."
        value={search}
        onChangeText={setSearch}
      />

      <Button title="Odjavi se" onPress={() => dispatch(logoutUser() as any)} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={trainers}
          keyExtractor={item => item._id}
          renderItem={({item}) => <TrainerCard trainer={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    paddingTop: 100,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
