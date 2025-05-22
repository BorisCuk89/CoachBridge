import React, {useState} from 'react';
import {View, Text, FlatList, TextInput, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import FeedCard from '../../components/FeedCard';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FavoritesScreen = () => {
  const {favorites} = useSelector((state: RootState) => state.trainer);
  const [search, setSearch] = useState('');

  const filteredFavorites = favorites.filter(
    item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.trainerName.toLowerCase().includes(search.toLowerCase()),
  );

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
          placeholder="Pretraži omiljene..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {filteredFavorites.length > 0 ? (
        <FlatList
          data={filteredFavorites}
          keyExtractor={item => item._id}
          renderItem={({item}) => <FeedCard item={item} />}
          contentContainerStyle={{paddingBottom: 100}}
        />
      ) : (
        <Text style={styles.emptyText}>
          Nema sačuvanih treninga ili planova.
        </Text>
      )}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    paddingHorizontal: 20,
    paddingTop: 60,
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
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
