import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchWallet, requestPayout} from '../../store/trainer/trainerSlice.ts';
import {RootState} from '../../store/store.ts';

const TrainerWalletScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const {wallet} = useSelector((state: RootState) => state.trainer);

  useEffect(() => {
    if (user) {
      dispatch(fetchWallet(user._id));
    }
  }, [dispatch, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>💰 Tvoj Wallet</Text>
      <Text style={styles.amount}>
        Dostupno za isplatu: {wallet?.availableForPayout}€
      </Text>

      <Button
        title="Zatraži isplatu"
        onPress={() => dispatch(requestPayout(user.id))}
        disabled={wallet?.availableForPayout === 0}
      />
      {/* Dugme za povratak */}
      <Button title="Nazad" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {fontSize: 22, fontWeight: 'bold', marginBottom: 10},
  amount: {fontSize: 18, marginBottom: 20, color: 'green'},
});

export default TrainerWalletScreen;
