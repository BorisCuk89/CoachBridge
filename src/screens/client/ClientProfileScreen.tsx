import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';

const ClientProfileScreen = ({navigation}) => {
  const {user} = useSelector((state: RootState) => state.auth);

  return (
    <View style={styles.container}>
      {/* Profilni podaci */}
      <View style={styles.profileSection}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Kupljeni paketi */}
      <Text style={styles.sectionTitle}>Kupljeni Trening Paketi</Text>
      <FlatList
        data={user?.purchasedPackages || []}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('TrainerPackageDetails', {
                trainingPackage: item,
              })
            }>
            <Image source={{uri: item.coverImage}} style={styles.image} />
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Planovi ishrane */}
      <Text style={styles.sectionTitle}>Kupljeni Planovi Ishrane</Text>
      <FlatList
        data={user?.purchasedMealPlans || []}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('MealPlanDetails', {mealPlan: item})
            }>
            <Image source={{uri: item.coverImage}} style={styles.image} />
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 15, paddingTop: 100},
  profileSection: {alignItems: 'center', marginBottom: 20},
  name: {fontSize: 24, fontWeight: 'bold'},
  email: {fontSize: 16, color: '#555'},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', marginTop: 20},
  card: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  image: {width: 80, height: 80, borderRadius: 8, marginRight: 10},
  cardTitle: {fontSize: 16, fontWeight: 'bold'},
  cardDesc: {fontSize: 14, color: '#555'},
});

export default ClientProfileScreen;
