import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from 'react-native';

const TrainerProfileScreen = ({route, navigation}) => {
  const {trainer} = route.params;
  const [contentType, setContentType] = useState<'trainings' | 'plans'>(
    'trainings',
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profilna slika */}
      <Image source={{uri: trainer.profileImage}} style={styles.image} />

      {/* Ime i titula */}
      <Text style={styles.name}>{trainer.name}</Text>
      <Text style={styles.title}>{trainer.title}</Text>

      {/* Ocena trenera */}
      <Text style={styles.rating}>
        {Array.from({length: 5}, (_, i) =>
          i < trainer.rating ? '★' : '☆',
        ).join(' ')}
      </Text>

      {/* Opis */}
      <Text style={styles.description}>{trainer.description}</Text>

      {/* Lista sertifikata */}
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

      {/* Dugmad za prikaz trening paketa i planova ishrane */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={
            contentType === 'trainings' ? styles.activeButton : styles.button
          }
          onPress={() => setContentType('trainings')}>
          <Text style={styles.buttonText}>Treninzi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={contentType === 'plans' ? styles.activeButton : styles.button}
          onPress={() => setContentType('plans')}>
          <Text style={styles.buttonText}>Planovi ishrane</Text>
        </TouchableOpacity>
      </View>

      {/* Lista sadržaja */}
      <View style={styles.contentContainer}>
        {contentType === 'trainings' ? (
          trainer.trainingPackages?.length > 0 ? (
            trainer.trainingPackages.map((packageItem, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.coverImageWrap}>
                  <Image
                    source={{uri: packageItem.coverImage}}
                    style={styles.coverImage}
                  />
                </View>
                <Text style={styles.cardTitle}>{packageItem.title}</Text>
                <Text style={styles.cardDescription}>
                  {packageItem.description}
                </Text>
                <Text style={styles.cardPrice}>Cena: {packageItem.price}€</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Trener trenutno nema dostupne trening pakete.
            </Text>
          )
        ) : trainer.mealPlans?.length > 0 ? (
          trainer.mealPlans.map((mealPlan, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.coverImageWrap}>
                <Image
                  source={{uri: mealPlan.coverImage}}
                  style={styles.coverImage}
                />
              </View>
              <Text style={styles.cardTitle}>{mealPlan.title}</Text>
              <Text style={styles.cardDescription}>{mealPlan.description}</Text>
              <Text style={styles.cardPrice}>Cena: {mealPlan.price}€</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            Trener trenutno nema dostupne planove ishrane.
          </Text>
        )}
      </View>

      {/* Dugme za povratak */}
      <Button title="Nazad" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 15},
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 50,
    marginBottom: 10,
    backgroundColor: 'grey',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  title: {fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 10},
  rating: {
    fontSize: 18,
    textAlign: 'center',
    color: '#f39c12',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'justify',
    color: '#444',
    marginBottom: 15,
  },
  section: {marginBottom: 10},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
  certItem: {fontSize: 14, color: '#555'},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  activeButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  contentContainer: {marginTop: 10},
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {fontSize: 18, fontWeight: 'bold'},
  cardDescription: {fontSize: 14, color: '#555', marginTop: 5},
  cardPrice: {fontSize: 16, fontWeight: 'bold', marginTop: 5},
  emptyText: {textAlign: 'center', color: '#777', fontStyle: 'italic'},
  coverImageWrap: {backgroundColor: 'grey', width: 50, height: 50},
  coverImage: {backgroundColor: 'grey'},
});

export default TrainerProfileScreen;
