import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import TrainerCard from '../components/TrainerCard';

const API_URL = 'http://localhost:5001/api/trainers';

const HomeScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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
