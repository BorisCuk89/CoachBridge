import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

const ClientProfileScreen = ({navigation}) => {
  const {user} = useSelector((state: RootState) => state.auth);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      {/* Kupljeni paketi */}
      <Text style={styles.sectionTitle}>Kupljeni Trening Paketi</Text>
      {user?.purchasedPackages?.length > 0 ? (
        <FlatList
          data={user.purchasedPackages}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 12}}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('TrainerPackageDetails', {
                  trainingPackage: item,
                })
              }>
              <Image source={{uri: item.coverImage}} style={styles.image} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>
          Još uvek nema kupljenih trening paketa.
        </Text>
      )}

      {/* Planovi ishrane */}
      <Text style={styles.sectionTitle}>Kupljeni Planovi Ishrane</Text>
      {user?.purchasedMealPlans?.length > 0 ? (
        <FlatList
          data={user.purchasedMealPlans}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 12}}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('MealPlanDetails', {mealPlan: item})
              }>
              <Image source={{uri: item.coverImage}} style={styles.image} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>
          Još uvek nema kupljenih planova ishrane.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1b1a1a',
    paddingBottom: 60,
    paddingTop: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d8f24e',
    marginBottom: 10,
    marginTop: 20,
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
    marginBottom: 10,
  },
});

export default ClientProfileScreen;
