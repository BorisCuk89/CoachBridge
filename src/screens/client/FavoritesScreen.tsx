import React, {useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import FeedCard from '../../components/FeedCard';
import HeaderMenu from '../../components/HeaderMenu.tsx';

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
      <HeaderMenu />

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
