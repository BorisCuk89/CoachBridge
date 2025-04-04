import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

const API_URL = 'http://localhost:5001/api';

const PaymentStatusScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {status, userId, packageId} = route.params || {};

  useEffect(() => {
    const confirmPurchase = async () => {
      if (status === 'success') {
        try {
          const res = await fetch(`${API_URL}/payments/payment-success`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userId, packageId}),
          });

          const data = await res.json();
          if (res.ok) {
            Alert.alert('✅ Kupovina uspešna', data.msg);
            // Možda želiš da navigiraš na "ClientProfile" ili "Home"
          } else {
            Alert.alert('⚠️ Greška', data.msg || 'Greška pri potvrdi plaćanja');
          }
        } catch (err) {
          console.error('❌ Network greška:', err);
          Alert.alert('❌ Network greška', err.message);
        }
      } else {
        Alert.alert('❌ Plaćanje nije uspelo');
      }
    };

    confirmPurchase();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#28a745" />
      <Text style={styles.text}>Obrađujem plaćanje...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {marginTop: 20, fontSize: 16},
});

export default PaymentStatusScreen;
