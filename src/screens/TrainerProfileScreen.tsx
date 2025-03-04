import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const TrainerDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const {trainer} = route.params;

  return (
    <View style={styles.container}>
      <Button title="⬅️ Nazad" onPress={() => navigation.goBack()} />
      <Text style={styles.name}>{trainer.name}</Text>
      <Text style={styles.title}>{trainer.title}</Text>
      <Text style={styles.description}>{trainer.description}</Text>
    </View>
  );
};

export default TrainerDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    color: 'gray',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
});
