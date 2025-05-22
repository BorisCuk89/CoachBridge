import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {toggleFavorite} from '../store/trainer/trainerSlice';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ✅ OVO NEDOSTAJE
import {RootState} from '../store/store'; // ✅ Treba i ovo ako koristiš RootState

const FeedCard = ({item}) => {
  const [coverError, setCoverError] = useState(false);
  const [trainerError, setTrainerError] = useState(false);
  const dispatch = useDispatch(); // ✅ MORA da postoji
  const {favorites} = useSelector((state: RootState) => state.trainer);
  const isFavorite = favorites.some(fav => fav._id === item._id);

  const getCoverImage = () => {
    if (coverError || !item.coverImage) {
      return item.type === 'training'
        ? require('../assets/placeholder_cover.jpg')
        : require('../assets/placeholder_meal_plan_cover.jpg');
    }
    return {uri: item.coverImage};
  };

  return (
    <TouchableOpacity style={styles.card}>
      <Image
        source={getCoverImage()}
        style={styles.cover}
        onError={() => setCoverError(true)}
      />

      <TouchableOpacity
        style={styles.starIcon}
        onPress={() => dispatch(toggleFavorite(item))}>
        <Ionicons
          name={isFavorite ? 'star' : 'star-outline'}
          size={24}
          color="#d8f24e"
        />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.detailText}>
            {item.type === 'training' ? '⏱️ 12 min' : '🥗 Plan ishrane'} –{' '}
            {item.price}€
          </Text>

          <View style={styles.trainerWrap}>
            <Image
              source={
                trainerError || !item.trainerImage
                  ? require('../assets/avatar-placeholder.png')
                  : {uri: item.trainerImage}
              }
              style={styles.trainerImg}
              onError={() => setTrainerError(true)}
            />
            <Text style={styles.trainerText}>{item.trainerName}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FeedCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cover: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 6,
  },
  detailText: {
    color: '#d8f24e',
    fontSize: 14,
  },
  trainerWrap: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    alignItems: 'center',
  },
  trainerImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 2,
    backgroundColor: '#d8f24e',
  },
  trainerText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 2,
    paddingTop: 5,
  },
  starIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#1b1a1a',
    padding: 6,
    borderRadius: 20,
  },
});
