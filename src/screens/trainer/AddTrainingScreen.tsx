import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import {API_BASE_URL} from '../../config.js';
import {useDispatch, useSelector} from 'react-redux';
import {addTrainingPackage} from '../../store/trainer/trainerSlice';
import {RootState} from '../../store/store.ts';

const {width} = Dimensions.get('window');

const AddTrainingPackageScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImageLoading, setCoverImageLoading] = useState(false);
  const [introVideo, setIntroVideo] = useState('');
  const [introVideoLoading, setIntroVideoLoading] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [trainingVideoLoadings, setTrainingVideoLoadings] = useState([]);
  const [loading, setLoading] = useState(false);

  const trainerId = user?.id || user?._id;

  const uploadFile = async file => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload/single`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.url;
  };

  const chooseMedia = (mediaType, onPick) => {
    Alert.alert('Izaberi opciju', 'Kamera ili galerija?', [
      {
        text: 'Kamera',
        onPress: async () => {
          const result = await launchCamera({mediaType});
          if (result.assets?.length) {
            const {uri, fileName: name, type} = result.assets[0];
            onPick(uri, name || 'default', type || `${mediaType}/*`);
          }
        },
      },
      {
        text: 'Galerija',
        onPress: async () => {
          const result = await launchImageLibrary({mediaType});
          if (result.assets?.length) {
            const {uri, fileName: name, type} = result.assets[0];
            onPick(uri, name || 'default', type || `${mediaType}/*`);
          }
        },
      },
      {text: 'Otkaži', style: 'cancel'},
    ]);
  };

  const pickCoverImage = () => {
    chooseMedia('photo', async (uri, name, type) => {
      setCoverImageLoading(true);
      const url = await uploadFile({uri, name, type});
      setCoverImage(url);
      setCoverImageLoading(false);
    });
  };

  const pickIntroVideo = () => {
    chooseMedia('video', async (uri, name, type) => {
      setIntroVideoLoading(true);
      const url = await uploadFile({uri, name, type});
      setIntroVideo(url);
      setIntroVideoLoading(false);
    });
  };

  const addTraining = () => {
    setTrainings([...trainings, {title: '', description: '', video: ''}]);
    setTrainingVideoLoadings([...trainingVideoLoadings, false]);
  };

  const updateTraining = (index, key, value) => {
    const updated = [...trainings];
    updated[index][key] = value;
    setTrainings(updated);
  };

  const uploadTrainingVideo = index => {
    const updatedLoaders = [...trainingVideoLoadings];
    updatedLoaders[index] = true;
    setTrainingVideoLoadings(updatedLoaders);

    chooseMedia('video', async (uri, name, type) => {
      const url = await uploadFile({uri, name, type});
      updateTraining(index, 'video', url);
      updatedLoaders[index] = false;
      setTrainingVideoLoadings([...updatedLoaders]);
    });
  };

  const removeTraining = index => {
    const updated = [...trainings];
    updated.splice(index, 1);
    const updatedLoaders = [...trainingVideoLoadings];
    updatedLoaders.splice(index, 1);
    setTrainings(updated);
    setTrainingVideoLoadings(updatedLoaders);
  };

  const savePackage = async () => {
    if (!trainerId) return Alert.alert('Greška', 'Trener nije prijavljen');
    setLoading(true);
    try {
      await dispatch(
        addTrainingPackage({
          trainerId,
          title,
          description,
          price: parseFloat(price),
          coverImage,
          introVideo,
          videos: trainings.map(t => ({
            title: t.title,
            description: t.description,
            videoUrl: t.video,
          })),
        }) as any,
      ).unwrap();
      Alert.alert('Uspeh', 'Paket je dodat');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Greška', e.message || 'Neuspešno čuvanje paketa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#1b1a1a'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#d8f24e" />
            </TouchableOpacity>

            <Text style={styles.title}>Novi Trening Paket</Text>

            <Text style={styles.label}>Naslov paketa</Text>
            <TextInput
              style={styles.input}
              placeholder="Naslov paketa"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.label}>Opis paketa</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Unesi opis paketa"
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
            />

            <Text style={styles.label}>Cena (€)</Text>
            <TextInput
              style={styles.input}
              placeholder="Cena"
              placeholderTextColor="#888"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Cover slika</Text>
            {coverImageLoading ? (
              <ActivityIndicator color="#fff" />
            ) : coverImage ? (
              <View style={styles.mediaContainer}>
                <Image source={{uri: coverImage}} style={styles.preview} />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => setCoverImage('')}>
                  <Ionicons name="trash-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={pickCoverImage}>
                <Text style={[styles.label, {textDecorationLine: 'underline'}]}>
                  Dodaj Cover Sliku
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.label}>Intro video</Text>
            {introVideoLoading ? (
              <ActivityIndicator color="#fff" />
            ) : introVideo ? (
              <View style={styles.mediaContainer}>
                <Video
                  source={{uri: introVideo}}
                  style={styles.videoPreview}
                  controls
                  paused={true}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => setIntroVideo('')}>
                  <Ionicons name="trash-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={pickIntroVideo}>
                <Text style={[styles.label, {textDecorationLine: 'underline'}]}>
                  Dodaj Intro Video
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.subtitle}>Treninzi u paketu</Text>
            {trainings.length === 0 && (
              <Text style={styles.emptyMessage}>
                Trenutno niste dodali ni jedan trening.
              </Text>
            )}

            {trainings.map((t, i) => (
              <View key={i} style={styles.trainingBlock}>
                <Text style={styles.label}>Naziv treninga</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Naziv treninga"
                  placeholderTextColor="#888"
                  value={t.title}
                  onChangeText={text => updateTraining(i, 'title', text)}
                />
                <Text style={styles.label}>Opis treninga</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Opis treninga"
                  placeholderTextColor="#888"
                  value={t.description}
                  onChangeText={text => updateTraining(i, 'description', text)}
                />
                <TouchableOpacity onPress={() => uploadTrainingVideo(i)}>
                  <Text style={styles.label}>Dodaj Video</Text>
                </TouchableOpacity>
                {trainingVideoLoadings[i] ? (
                  <ActivityIndicator color="#fff" />
                ) : t.video ? (
                  <Video
                    source={{uri: t.video}}
                    style={styles.videoPreview}
                    controls
                    paused={true}
                    resizeMode="contain"
                  />
                ) : null}
                <TouchableOpacity onPress={() => removeTraining(i)}>
                  <Text style={{color: 'red', marginTop: 6}}>
                    Obriši trening
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.button} onPress={addTraining}>
              <Text style={styles.buttonText}>+ Dodaj novi trening</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={savePackage}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Sačuvaj paket</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddTrainingPackageScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b1a1a',
    padding: 20,
    paddingBottom: 140,
  },
  backButton: {
    marginBottom: 20,
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 60,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  label: {
    color: '#fff',
    marginBottom: 6,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  videoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: '#000',
  },
  trainingBlock: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#d8f24e',
    padding: 14,
    borderRadius: 28,
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonText: {
    color: '#1b1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mediaContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 20,
    zIndex: 2,
  },
  textarea: {
    textAlignVertical: 'top',
    height: 120,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  emptyMessage: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
  },
});
