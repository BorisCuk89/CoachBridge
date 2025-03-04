import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation(); // ✅ Sada koristimo useNavigation()

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (navigation && navigation.reset) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Welcome'}],
        });
      } else {
        console.log('⚠️ Navigation object is not ready yet.');
      }
    }, 2000);

    return () => clearTimeout(timeout); // Čisti timeout ako se komponenta unmountuje
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Učitavanje...</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});
