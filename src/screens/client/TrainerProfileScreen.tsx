import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TrainerProfileScreen = ({route, navigation}) => {
  const {trainer} = route.params;
  const [contentType, setContentType] = useState<'trainings' | 'plans'>(
    'trainings',
  );

  return (
    <ScrollView style={styles.container}>
      {/* Strelica za nazad */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#d8f24e" />
      </TouchableOpacity>

      {/* Profilna slika */}
      {trainer.profileImage ? (
        <Image source={{uri: trainer.profileImage}} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}

      {/* Ime i titula */}
      <Text style={styles.name}>{trainer.name}</Text>
      <Text style={styles.title}>{trainer.title}</Text>

      {/* Ocena */}
      <View style={styles.ratingRow}>
        {Array.from({length: 5}, (_, i) => (
          <Text key={i} style={styles.star}>
            {i < trainer.rating ? '★' : '☆'}
          </Text>
        ))}
      </View>

      {/* Opis */}
      <Text style={styles.description}>{trainer.description}</Text>

      {/* Sertifikati */}
      {trainer.certificates?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sertifikati:</Text>
          {trainer.certificates.map((cert, index) => (
            <Text key={index} style={styles.certItem}>
              ✅ {cert}
            </Text>
          ))}
        </View>
      )}

      {/* Tabovi */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            contentType === 'trainings' && styles.activeTabButton,
          ]}
          onPress={() => setContentType('trainings')}>
          <Text
            style={[
              styles.tabButtonText,
              contentType === 'trainings' && styles.activeTabText,
            ]}>
            Treninzi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            contentType === 'plans' && styles.activeTabButton,
          ]}
          onPress={() => setContentType('plans')}>
          <Text
            style={[
              styles.tabButtonText,
              contentType === 'plans' && styles.activeTabText,
            ]}>
            Planovi ishrane
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sadržaj */}
      <View style={styles.contentContainer}>
        {contentType === 'trainings' ? (
          trainer.trainingPackages?.length > 0 ? (
            trainer.trainingPackages.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('TrainerPackageDetails', {
                    trainingPackage: item,
                    trainer,
                  })
                }>
                <Image
                  source={{uri: item.coverImage}}
                  style={styles.coverImage}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                  <Text style={styles.cardPrice}>Cena: {item.price}€</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Trener trenutno nema dostupne trening pakete.
            </Text>
          )
        ) : trainer.mealPlans?.length > 0 ? (
          trainer.mealPlans.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate('MealPlanDetails', {
                  mealPlan: item,
                  trainer,
                })
              }>
              <Image
                source={{uri: item.coverImage}}
                style={styles.coverImage}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardPrice}>Cena: {item.price}€</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>
            Trener trenutno nema dostupne planove ishrane.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1b1a1a', padding: 20},
  backButton: {
    position: 'absolute',
    top: 105,
    left: 20,
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: '#444',
    marginTop: 80,
    marginBottom: 15,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  star: {
    fontSize: 20,
    color: '#f39c12',
    marginHorizontal: 1,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 15,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#d8f24e',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  certItem: {
    color: '#eee',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#2e2e2e',
  },
  activeTabButton: {
    backgroundColor: '#d8f24e',
  },
  tabButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#1b1a1a',
  },
  contentContainer: {
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2e2e2e',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  coverImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#555',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 14,
    color: '#d8f24e',
    marginTop: 4,
    fontWeight: '600',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default TrainerProfileScreen;
