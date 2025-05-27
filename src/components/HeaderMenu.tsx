import React, {useState} from 'react';
import {View, Image, StyleSheet, Alert} from 'react-native';
import {Menu, Divider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {logoutUser} from '../store/auth/authSlice.ts';

const HeaderMenu = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogout = () => {
    Alert.alert('Odjava', 'Da li ste sigurni da želite da se odjavite?', [
      {text: 'Otkaži', style: 'cancel'},
      {text: 'Odjavi se', onPress: () => dispatch(logoutUser() as any)},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Ionicons name="menu" size={24} color="#fff" onPress={openMenu} />
          }>
          <Menu.Item
            onPress={() => {
              closeMenu();
              navigation.navigate('ClientProfile');
            }}
            title="Profil"
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              navigation.navigate('SettingsScreen');
            }}
            title="Podešavanja"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              closeMenu();
              handleLogout();
            }}
            title="Odjavi se"
          />
        </Menu>
      </View>

      <Image
        source={require('../assets/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default HeaderMenu;

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
  },
  menuContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  logo: {
    width: 160,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24,
  },
});
