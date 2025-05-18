import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/store.ts';
import {purchasePackageAndPlan} from '../../store/auth/authSlice.ts';

const {height: screenHeight} = Dimensions.get('window');

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
      purchasePackageAndPlan({
        userId: user._id || user.id,
        itemId: trainingPackage._id,
        type: 'package',
      }),
    );
    setPurchased(true);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Strelica nazad */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#d8f24e" />
      </TouchableOpacity>

      {/* Slika paketa */}
      <Image
        source={{uri: trainingPackage.coverImage}}
        style={styles.coverImage}
      />

      {/* Naslov i opis */}
      <Text style={styles.title}>{trainingPackage.title}</Text>
      <Text style={styles.description}>{trainingPackage.description}</Text>

      {/* Dugme za kupovinu */}
      {!purchased && (
        <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buyButtonText}>
              Kupi za {trainingPackage.price}€
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Lista videa */}
      <View style={{flex: 1, marginTop: 20}}>
        <FlatList
          data={trainingPackage.videos}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          renderItem={({item, index}) => {
            const locked = !purchased && index > 1;
            return (
              <View style={styles.card}>
                {/* LEVA STRANA */}
                <View style={{flex: 1}}>
                  <Text style={styles.videoTitle}>{item.title}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color="#fff" />
                    <Text style={styles.metaText}>
                      {item.duration || '30'} min
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="flame-outline" size={14} color="#fff" />
                    <Text style={styles.metaText}>
                      {item.kcal || '1200'} Kcal
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="barbell-outline" size={14} color="#fff" />
                    <Text style={styles.metaText}>
                      {item.exerciseCount || '5'} vežbi
                    </Text>
                  </View>
                </View>

                {/* DESNA STRANA */}
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{uri: item.coverImage}}
                    style={[styles.thumbnail, locked && {opacity: 0.3}]}
                  />
                  <Ionicons
                    name="play-circle"
                    size={26}
                    color={locked ? '#aaa' : '#fff'}
                    style={styles.playIcon}
                  />
                </View>
              </View>
            );
          }}
        />

        {/* Fade overlay ako nije kupljeno */}
        {!purchased && (
          <LinearGradient
            colors={['transparent', '#1b1a1a']}
            style={styles.fadeOverlay}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 105,
    left: 20,
    zIndex: 10,
  },
  coverImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    backgroundColor: '#333',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 6,
  },
  buyButton: {
    marginTop: 16,
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2b2b2b',
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#ccc',
  },
  thumbnailContainer: {
    marginLeft: 12,
    position: 'relative',
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 14,
    backgroundColor: '#555',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -13,
    marginTop: -13,
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    height: 150,
    width: '100%',
  },
});

export default TrainerPackageDetailsScreen;
