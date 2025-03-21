import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store/store';
import {purchaseMealPlan} from '../store/auth/authSlice';

const MealPlanDetailsScreen = ({route, navigation}) => {
  const {mealPlan} = route.params;
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(
    user?.purchasedMealPlans?.includes(mealPlan._id),
  );

  const handlePurchase = async () => {
    setLoading(true);
    await dispatch(purchaseMealPlan({userId: user._id, planId: mealPlan._id}));
    setPurchased(true);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: mealPlan.coverImage}} style={styles.cover} />
      <Text style={styles.title}>{mealPlan.title}</Text>
      <Text style={styles.description}>{mealPlan.description}</Text>

      {!purchased ? (
        <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buyButtonText}>Kupi za {mealPlan.price}€</Text>
          )}
        </TouchableOpacity>
      ) : (
        <Text style={styles.unlockedText}>Kupljeno ✅</Text>
      )}
      {/* Dugme za povratak */}
      <Button title="Nazad" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 10},
  cover: {width: '100%', height: 200, borderRadius: 10},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  unlockedText: {
    color: '#28a745',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MealPlanDetailsScreen;
