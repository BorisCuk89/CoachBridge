import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const TrainerCard = ({trainer}) => {
  const navigation = useNavigation();

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starContainer}>
        {Array.from({length: 5}, (_, i) => (
          <Icon
            key={i}
            name={i < rating ? 'star' : 'star-o'}
            size={14}
            color="#facc15"
            style={{marginRight: 2}}
          />
        ))}
      </View>
    );
  };

  const placeholder = require('../assets/avatar-placeholder.png');
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TrainerProfile', {trainer})}>
      <Image
        source={
          imageError || !trainer.profileImage
            ? placeholder
            : {uri: trainer.profileImage}
        }
        style={styles.image}
        onError={() => {
          console.log('sas');
          setImageError(true);
        }}
      />
      {/*<Image source={{uri: trainer.profileImage}} style={styles.image} />*/}
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{trainer.name}</Text>
          <Text style={styles.tag}>
            {trainer.specialty || 'Personalni trener'}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {trainer.description}
        </Text>

        {renderStars(trainer.rating || 0)}

        <View style={styles.statsRow}>
          <Icon name="users" size={14} color="#ccc" />
          <Text style={styles.statText}>
            {' '}
            {trainer.clientsCount || 0} klijenata
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TrainerCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#2b2b2b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#444',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flexShrink: 1,
  },
  tag: {
    fontSize: 12,
    backgroundColor: '#a58af8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    color: '#1b1a1a',
    marginLeft: 6,
  },
  description: {
    fontSize: 13,
    color: '#ccc',
    marginBottom: 6,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 4,
  },
});
