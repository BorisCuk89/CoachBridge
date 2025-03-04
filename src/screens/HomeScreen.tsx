import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {logoutUser} from '../store/auth/authSlice';

const API_URL = 'http://localhost:5001/api/trainers';

const HomeScreen = ({navigation}) => {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser() as any); // ⏳ Sačekaj da Redux resetuje stanje
    navigation.reset({
      index: 0,
      routes: [{name: 'Welcome'}],
    });
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTrainers(data);
      setFilteredTrainers(data);
    } catch (error) {
      console.error('Greška pri učitavanju trenera:', error);
    }
  };

  // Pretraga trenera
  const handleSearch = text => {
    setSearch(text);
    const filtered = trainers.filter(trainer =>
      trainer.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredTrainers(filtered);
  };

  const renderTrainer = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TrainerProfile', {trainer: item})}>
      <Image source={{uri: item.image}} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Pretraži trenere..."
        value={search}
        onChangeText={handleSearch}
      />
      <Button title="Odjavi se" onPress={handleLogout} />
      <FlatList
        data={filteredTrainers}
        keyExtractor={item => item.id}
        renderItem={renderTrainer}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    color: 'gray',
  },
  description: {
    fontSize: 12,
    color: 'darkgray',
  },
});
