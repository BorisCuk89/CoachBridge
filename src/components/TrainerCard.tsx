import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const TrainerCard = ({trainer}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TrainerProfile', {trainer})}>
      <Image source={{uri: trainer.profileImage}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{trainer.name}</Text>
        <Text style={styles.title}>{trainer.title}</Text>
        <Text style={styles.rating}>
          {Array.from({length: 5}, (_, i) =>
            i < trainer.rating ? '★' : '☆',
          ).join(' ')}
        </Text>
        <Text numberOfLines={2} style={styles.description}>
          {trainer.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    fontSize: 16,
    color: '#f39c12',
    marginVertical: 5,
  },
  description: {
    fontSize: 12,
    color: '#777',
  },
});

export default TrainerCard;
