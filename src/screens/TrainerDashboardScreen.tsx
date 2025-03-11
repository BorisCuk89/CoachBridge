import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Button, StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store.ts';
import {logoutUser} from '../store/auth/authSlice.ts';

const API_URL = 'http://localhost:5001/api/trainers';

const TrainerDashboardScreen = ({navigation}) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [packages, setPackages] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    // try {
    //   const response = await fetch(`${API_URL}/${user._id}/packages`);
    //   const data = await response.json();
    //   setPackages(data);
    // } catch (error) {
    //   console.error('❌ Greška pri dohvatanju paketa', error);
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moji Trening Paketi</Text>

      <Text style={styles.description}>{user?.name}</Text>
      <Text style={styles.description}>{user?.title}</Text>
      <Text style={styles.description}>{user?.description}</Text>

      <Button title="Odjavi se" onPress={() => dispatch(logoutUser() as any)} />

      <FlatList
        data={packages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.packageTitle}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>Cena: {item.price}€</Text>
          </View>
        )}
      />

      <Button
        title="Dodaj novi paket"
        // onPress={() => navigation.navigate('AddPackage', {trainer})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    paddingTop: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default TrainerDashboardScreen;
