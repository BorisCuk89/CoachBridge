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
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootState} from '../../store/store';
import {fetchTrainerContent} from '../../store/trainer/trainerSlice';
import {logoutUser} from '../../store/auth/authSlice';

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

  console.log('user ', user);

  const data = contentType === 'trainings' ? trainings : mealPlans;

  return (
    <View style={styles.container}>
      {/* Profil */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: user?.profileImage || 'https://via.placeholder.com/150',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <TouchableOpacity onPress={() => dispatch(logoutUser() as any)}>
          <Text style={styles.logoutText}>Odjavi se</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{user?.title}</Text>
        <Text style={styles.description}>{user?.description}</Text>
      </View>

      {/* Wallet */}
      <TouchableOpacity
        onPress={() => navigation.navigate('TrainerWallet')}
        style={styles.walletButton}>
        <Ionicons name="wallet-outline" size={22} color="#1b1a1a" />
        <Text style={styles.walletText}>Trainer Wallet</Text>
      </TouchableOpacity>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            contentType === 'trainings' && styles.activeFilter,
          ]}
          onPress={() => setContentType('trainings')}>
          <Text
            style={[
              styles.filterText,
              contentType === 'trainings' && styles.activeFilterText,
            ]}>
            Treninzi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            contentType === 'plans' && styles.activeFilter,
          ]}
          onPress={() => setContentType('plans')}>
          <Text
            style={[
              styles.filterText,
              contentType === 'plans' && styles.activeFilterText,
            ]}>
            Planovi ishrane
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator size="large" color="#d8f24e" />
      ) : data.length === 0 ? (
        <Text style={styles.emptyText}>Trenutno nema sadržaja</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Image
                source={{uri: item.coverImage}}
                style={styles.coverImage}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardPrice}>Cena: {item.price}€</Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Dodaj dugme */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
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
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#444',
    marginBottom: 10,
  },
  name: {fontSize: 20, fontWeight: 'bold', color: '#fff'},
  logoutText: {color: '#d8f24e', fontWeight: 'bold', marginTop: 6},
  title: {fontSize: 14, color: '#ccc'},
  description: {fontSize: 13, color: '#888', textAlign: 'center', marginTop: 4},
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#d8f24e',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  walletText: {
    marginLeft: 8,
    color: '#1b1a1a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  filterText: {
    color: '#ccc',
    fontWeight: '500',
  },
  activeFilter: {
    backgroundColor: '#d8f24e',
  },
  activeFilterText: {
    color: '#1b1a1a',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  coverImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#555',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 14,
    color: '#d8f24e',
    marginTop: 4,
    fontWeight: '600',
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  modalButton: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    backgroundColor: '#d8f24e',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {backgroundColor: '#dc3545'},
  modalButtonText: {color: '#1b1a1a', fontSize: 16, fontWeight: 'bold'},
});

export default TrainerDashboardScreen;
