import React from 'react';
import {View, Text, Image, StyleSheet, ScrollView, Button} from 'react-native';

const TrainerProfileScreen = ({route, navigation}) => {
  const {trainer} = route.params;

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

      {/* Dugme za povratak */}
      <Button title="Nazad" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
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
  title: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
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
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  certItem: {
    fontSize: 14,
    color: '#555',
  },
});

export default TrainerProfileScreen;
