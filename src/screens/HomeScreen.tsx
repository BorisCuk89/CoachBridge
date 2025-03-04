import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

const API_URL = 'http://localhost:5001/api/trainers';

const HomeScreen = ({navigation}) => {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTrainers();
  }, [search]);

  const fetchTrainers = async () => {
    try {
      const response = await fetch(`${API_URL}?search=${search}`);
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error('❌ Greška pri dohvatanju trenera', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Pretraži trenere..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={trainers}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('TrainerProfile', {trainer: item})
            }>
            <Image source={{uri: item.profileImage}} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.description}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  searchInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    width: 350,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  info: {
    flex: 1,
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
