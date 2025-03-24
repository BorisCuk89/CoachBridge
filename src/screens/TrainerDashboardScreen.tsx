import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Button,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store/store';
import {fetchTrainerContent} from '../store/trainer/trainerSlice';
import {logoutUser} from '../store/auth/authSlice.ts';

const TrainerDashboardScreen = ({navigation}) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const {trainings, mealPlans, loading} = useSelector(
    (state: RootState) => state.trainer,
  );
  const dispatch = useDispatch();

  const [contentType, setContentType] = useState<'trainings' | 'plans'>(
    'trainings',
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(
        fetchTrainerContent({
          trainerId: user.id || user._id,
          contentType,
        }) as any,
      );
    }
  }, [contentType, dispatch, user]);

  const data = contentType === 'trainings' ? trainings : mealPlans;

  return (
    <View style={styles.container}>
      {/* 📌 Prikaz profila trenera */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: user?.profileImage || 'https://via.placeholder.com/150',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Button
          title="Odjavi se"
          onPress={() => dispatch(logoutUser() as any)}
        />
        <Text style={styles.title}>{user?.title}</Text>
        <Text style={styles.description}>{user?.description}</Text>
      </View>

      <Button
        title="Trainer Wallet"
        onPress={() => navigation.navigate('TrainerWallet')}
      />

      {/* 📌 Sortiranje sadržaja */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setContentType('trainings')}
          style={
            contentType === 'trainings'
              ? styles.activeFilter
              : styles.filterButton
          }>
          <Text style={styles.filterText}>Treninzi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setContentType('plans')}
          style={
            contentType === 'plans' ? styles.activeFilter : styles.filterButton
          }>
          <Text style={styles.filterText}>Planovi ishrane</Text>
        </TouchableOpacity>
      </View>

      {/* 📌 Lista trening paketa ili planova ishrane */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : data.length === 0 ? (
        <Text style={styles.emptyText}>Trenutno nema sadržaja</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={styles.coverImageWrap}>
                <Image
                  source={{uri: item.coverImage}}
                  style={styles.coverImage}
                />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.cardPrice}>Cena: {item.price}€</Text>
            </View>
          )}
        />
      )}

      {/* 📌 Dugme za dodavanje */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* 📌 Modal za izbor između treninga i plana ishrane */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dodaj novi sadržaj</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('AddTraining');
              }}>
              <Text style={styles.modalButtonText}>Dodaj trening paket</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('AddMealPlan');
              }}>
              <Text style={styles.modalButtonText}>Dodaj plan ishrane</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Otkaži</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 10},
  profileContainer: {alignItems: 'center', marginBottom: 20},
  profileImage: {width: 100, height: 100, borderRadius: 50, marginBottom: 10},
  name: {fontSize: 22, fontWeight: 'bold'},
  title: {fontSize: 16, color: '#555'},
  description: {fontSize: 14, color: '#777', textAlign: 'center', marginTop: 5},
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  activeFilter: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  filterText: {color: '#fff', fontWeight: 'bold'},
  emptyText: {textAlign: 'center', fontSize: 16, color: '#888', marginTop: 20},
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {fontSize: 18, fontWeight: 'bold'},
  cardDescription: {fontSize: 14, color: '#555', marginTop: 5},
  cardPrice: {fontSize: 16, fontWeight: 'bold', marginTop: 5},
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#28a745',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {color: '#fff', fontSize: 30, fontWeight: 'bold'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 15},
  modalButton: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {backgroundColor: '#dc3545'},
  modalButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  coverImageWrap: {backgroundColor: 'grey', width: 50, height: 50},
  coverImage: {maxWidth: '100%'},
});

export default TrainerDashboardScreen;
