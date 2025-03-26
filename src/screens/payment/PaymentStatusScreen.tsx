import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';

const PaymentStatusScreen = ({route}) => {
  const navigation = useNavigation();
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [packageId, setPackageId] = useState('');

  return (
    <View style={styles.container}>
      {/*{status === 'success' ? (*/}
      {/*  <Text style={styles.successText}>✅ Plaćanje je uspešno!</Text>*/}
      {/*) : (*/}
      {/*  <Text style={styles.failedText}>❌ Plaćanje nije uspelo.</Text>*/}
      {/*)}*/}

      <View style={styles.buttonContainer}>
        {/*{status === 'success' && (*/}
        {/*  <Button*/}
        {/*    title="🏋 Nastavi kupovinu"*/}
        {/*    onPress={() =>*/}
        {/*      navigation.navigate('TrainerProfile', {trainerId: userId})*/}
        {/*    }*/}
        {/*  />*/}
        {/*)}*/}
        <Button
          title="👤 Moj profil"
          onPress={() => console.log('moj profil')}
        />
        <Button
          title="🏠 Početna"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
  },
  failedText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
});

export default PaymentStatusScreen;
