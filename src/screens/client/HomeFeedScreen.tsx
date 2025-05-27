import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {fetchGlobalFeed} from '../../store/trainer/trainerSlice';
import FeedCard from '../../components/FeedCard.tsx';
import {logoutUser} from '../../store/auth/authSlice.ts';
import HeaderMenu from '../../components/HeaderMenu';

const HomeFeedScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {feed, loading, error} = useSelector(
    (state: RootState) => state.trainer,
  );
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'training' | 'meal'>('all');

  const loadFeed = useCallback(() => {
    dispatch(fetchGlobalFeed());
  }, [dispatch]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchGlobalFeed());
    setRefreshing(false);
  };

  const filteredFeed = feed.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.trainerName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      item.type === (filter === 'meal' ? 'meal' : 'training');

    return matchesSearch && matchesFilter;
  });

  const renderItem = ({item}) => <FeedCard item={item} />;

  const handleLogout = () => {
    Alert.alert('Odjava', 'Da li ste sigurni da želite da se odjavite?', [
      {text: 'Otkaži', style: 'cancel'},
      {text: 'Odjavi se', onPress: () => dispatch(logoutUser() as any)},
    ]);
  };

  return (
    <View style={styles.container}>
      <HeaderMenu />

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#d8f24e"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pretraži trenere ili pakete..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        <Text
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('all')}>
          Sve
        </Text>
        <Text
          style={[
            styles.filterButton,
            filter === 'training' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('training')}>
          Treninzi
        </Text>
        <Text
          style={[
            styles.filterButton,
            filter === 'meal' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('meal')}>
          Ishrana
        </Text>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color="#d8f24e"
          style={{marginTop: 20}}
        />
      ) : (
        <FlatList
          data={filteredFeed}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{paddingBottom: 100}}
        />
      )}

      {error && (
        <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default HomeFeedScreen;

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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 12,
  },
  filterButton: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
  },
  filterButtonActive: {
    color: '#1b1a1a',
    backgroundColor: '#d8f24e',
  },
  menuContainer: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 10,
  },
});
