import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import Video from 'react-native-video';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/store.ts';
import {purchaseTrainingPackage} from '../../store/auth/authSlice.ts';

const TrainerPackageDetailsScreen = ({route, navigation}) => {
  const {trainingPackage} = route.params;
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(
    user?.purchasedPackages?.includes(trainingPackage._id),
  );

  const handlePurchase = async () => {
    setLoading(true);
    await dispatch(
      purchaseTrainingPackage({
        userId: user._id || user.id,
        packageId: trainingPackage._id,
      }),
    );
    setLoading(false);
  };

  // 📌 Provera da li je link do videa validan
  const isValidUrl = (url: string | undefined) => {
    return !!url && url.startsWith('http');
  };

  return (
    <View style={styles.container}>
      {/* Cover Slika */}
      <Image source={{uri: trainingPackage.coverImage}} style={styles.cover} />
      Intro Video
      {trainingPackage.introVideo && (
        <View style={styles.introVideoWrap}>
          {isValidUrl(trainingPackage.introVideo) && (
            <Video
              source={{uri: trainingPackage.introVideo}}
              style={styles.video}
              controls
            />
          )}
        </View>
      )}
      {/* Naslov i opis */}
      <Text style={styles.title}>{trainingPackage.title}</Text>
      <Text style={styles.description}>{trainingPackage.description}</Text>
      {/* Cena i dugme za kupovinu */}
      {!purchased ? (
        <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buyButtonText}>
              Kupi za {trainingPackage.price}€
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <Text style={styles.unlockedText}>Kupljeno ✅</Text>
      )}
      {/* Lista videa (sakrivena ako nije kupljeno) */}
      {purchased && (
        <FlatList
          data={trainingPackage.videos}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.videoItem}>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Video
                source={{uri: item.videoUrl}}
                style={styles.video}
                controls
              />
            </View>
          )}
        />
      )}
      {/* Dugme za povratak */}
      <Button title="Nazad" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 10},
  cover: {width: '100%', height: 200, borderRadius: 10},
  video: {width: '100%', height: 200, marginVertical: 10},
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
  videoItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  videoTitle: {fontSize: 16, fontWeight: 'bold'},
  introVideoWrap: {backgroundColor: 'grey', height: 100},
});

export default TrainerPackageDetailsScreen;
