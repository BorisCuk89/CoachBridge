import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const LoginScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.replace('Home')} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
