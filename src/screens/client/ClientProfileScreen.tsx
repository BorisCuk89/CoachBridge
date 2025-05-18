import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

const {width} = Dimensions.get('window');

const ClientProfileScreen = ({navigation}) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [selectedTab, setSelectedTab] = useState<'packages' | 'meals'>(
    'packages',
  );

  const renderCard = (item, type: 'package' | 'meal') => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(
          type === 'package' ? 'TrainerPackageDetails' : 'MealPlanDetails',
          {[type === 'package' ? 'trainingPackage' : 'mealPlan']: item},
        )
      }>
      <Image source={{uri: item.coverImage}} style={styles.image} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  const activeList =
    selectedTab === 'packages'
      ? user?.purchasedPackages
      : user?.purchasedMealPlans;

  const emptyMessage =
    selectedTab === 'packages'
      ? 'Još uvek nema kupljenih trening paketa.'
      : 'Još uvek nema kupljenih planova ishrane.';

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#1b1a1a'}}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {/* Profilni podaci */}
      <View style={styles.profileSection}>
        <Image
          source={
            user?.profileImage
              ? {uri: user.profileImage}
              : require('../../assets/avatar-placeholder.png')
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Toggle tabovi */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedTab === 'packages' && styles.activeToggle,
          ]}
          onPress={() => setSelectedTab('packages')}>
          <Text
            style={[
              styles.toggleText,
              selectedTab === 'packages' && styles.activeToggleText,
            ]}>
            Trening Paketi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedTab === 'meals' && styles.activeToggle,
          ]}
          onPress={() => setSelectedTab('meals')}>
          <Text
            style={[
              styles.toggleText,
              selectedTab === 'meals' && styles.activeToggleText,
            ]}>
            Planovi Ishrane
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sadržaj izabrane sekcije */}
      {activeList?.length > 0 ? (
        <FlatList
          data={activeList}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 12, paddingVertical: 10}}
          renderItem={({item}) =>
            renderCard(item, selectedTab === 'packages' ? 'package' : 'meal')
          }
        />
      ) : (
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      )}
    </ScrollView>
  );
};

export default ClientProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1b1a1a',
    paddingBottom: 60,
    paddingTop: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#aaa',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    marginTop: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleText: {
    color: '#ccc',
    fontWeight: '500',
  },
  activeToggle: {
    backgroundColor: '#d8f24e',
  },
  activeToggleText: {
    color: '#1b1a1a',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#2b2b2b',
    borderRadius: 10,
    padding: 12,
    width: 200,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  cardDesc: {
    color: '#ccc',
    fontSize: 12,
  },
  emptyText: {
    color: '#777',
    fontStyle: 'italic',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
});
