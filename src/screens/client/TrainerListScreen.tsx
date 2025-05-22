import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Image} from 'react-native';
import TrainerCard from '../../components/TrainerCard.tsx';

const API_URL = 'http://localhost:5001/api/trainers';

const TrainerListScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('najbolji');

  useEffect(() => {
    fetchTrainers();
  }, [search, filter]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?search=${search}`);
      const data = await response.json();
      if (filter === 'najbolji') {
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (filter === 'noviji') {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      setTrainers(data);
    } catch (error) {
      console.error('❌ Greška pri dohvatanju trenera', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.jpg')} style={styles.logo} />

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#d8f24e"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pretraži trenere..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity
          onPress={() => setFilter('najbolji')}
          style={[
            styles.filterButton,
            filter === 'najbolji' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterText,
              filter === 'najbolji' && styles.filterTextSelected,
            ]}>
            Najbolji
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter('noviji')}
          style={[
            styles.filterButton,
            filter === 'noviji' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterText,
              filter === 'noviji' && styles.filterTextSelected,
            ]}>
            Noviji
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#d8f24e"
          style={{marginTop: 20}}
        />
      ) : (
        <FlatList
          data={trainers}
          keyExtractor={item => item._id}
          renderItem={({item}) => <TrainerCard trainer={item} />}
          contentContainerStyle={{paddingBottom: 30}}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default TrainerListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  logoutText: {
    color: '#d8f24e',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    width: 160,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#2b2b2b',
  },
  filterButtonSelected: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#d8f24e',
  },
  filterText: {
    color: '#ccc',
    fontSize: 13,
  },
  filterTextSelected: {
    color: '#1b1a1a',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
