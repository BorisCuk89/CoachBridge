import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {logoutUser} from '../../store/auth/authSlice.ts';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleLogout = () => {
    Alert.alert('Odjava', 'Da li ste sigurni da želite da se odjavite?', [
      {text: 'Otkaži', style: 'cancel'},
      {text: 'Odjavi se', onPress: () => dispatch(logoutUser() as any)},
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Podešavanja</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Notifikacije</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={value => setNotificationsEnabled(value)}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Odjavi se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    backgroundColor: '#f5f5f5',
  },
  heading: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  label: {fontSize: 16},
  logoutButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
