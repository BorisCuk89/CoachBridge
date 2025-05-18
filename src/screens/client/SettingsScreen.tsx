import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {
  logoutUser,
  deleteAccount,
  resetDeleteAccountStatus,
} from '../../store/auth/authSlice.ts';
import {RootState} from '../../store/store.ts';

const SettingsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const {accountDeleteStatus, accountDeleteError} = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (accountDeleteStatus === 'success') {
      Alert.alert('Uspešno', 'Nalog obrisan.');
      dispatch(resetDeleteAccountStatus());
      navigation.reset({index: 0, routes: [{name: 'Welcome'}]});
    } else if (accountDeleteStatus === 'error') {
      Alert.alert(
        'Greška',
        accountDeleteError || 'Nije moguće obrisati nalog.',
      );
      dispatch(resetDeleteAccountStatus());
    }
  }, [accountDeleteStatus]);

  const handleLogout = () => {
    Alert.alert('Odjava', 'Da li ste sigurni da želite da se odjavite?', [
      {text: 'Otkaži', style: 'cancel'},
      {text: 'Odjavi se', onPress: () => dispatch(logoutUser() as any)},
    ]);
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword'); // 🔑 napravi ekran
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Brisanje naloga',
      'Da li ste sigurni da želite da izbrišete svoj nalog? Ova akcija je trajna.',
      [
        {text: 'Otkaži', style: 'cancel'},
        {
          text: 'Izbriši',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteAccount() as any)
              .unwrap()
              .then(() => {
                Alert.alert('Uspešno', 'Vaš nalog je obrisan.');
                navigation.reset({index: 0, routes: [{name: 'Welcome'}]});
              })
              .catch(error => {
                Alert.alert('Greška', error || 'Nije uspelo brisanje naloga.');
              });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Podešavanja</Text>

      {/* Sekcija: Sistem */}
      <View style={styles.settingRow}>
        <Text style={styles.label}>Notifikacije</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Face ID / Otisak</Text>
        <Switch
          value={biometricsEnabled}
          onValueChange={setBiometricsEnabled}
        />
      </View>

      <TouchableOpacity
        style={styles.settingRow}
        onPress={handleChangePassword}>
        <Text style={styles.label}>Promeni lozinku</Text>
        <Icon name="chevron-forward-outline" size={20} color="#888" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => Linking.openURL('mailto:support@couchbridge.fit')}>
        <Text style={styles.label}>Kontaktiraj podršku</Text>
        <Icon name="mail-outline" size={20} color="#888" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingRow}
        onPress={() =>
          Alert.alert('Politika privatnosti', 'Ovde ide tekst...')
        }>
        <Text style={styles.label}>Politika privatnosti</Text>
        <Icon name="document-outline" size={20} color="#888" />
      </TouchableOpacity>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Verzija aplikacije</Text>
        <Text style={styles.version}>v1.0.0</Text>
      </View>

      {/* Brisanje naloga */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAccount}>
        <Text style={styles.deleteText}>Izbriši nalog</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Odjavi se</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#2b2b2b',
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  version: {
    fontSize: 14,
    color: '#888',
  },
  logoutButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#444',
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
});
