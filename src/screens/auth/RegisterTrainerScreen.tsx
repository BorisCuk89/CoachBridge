import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {registerTrainer} from '../../store/auth/authSlice.ts';
import {RootState} from '../../store/store.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {API_BASE_URL} from '../../config.js';

const {width} = Dimensions.get('window');

const RegisterTrainerScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, error} = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [certificates, setCertificates] = useState<string[]>([]);
  const [introVideo, setIntroVideo] = useState('');

  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isUploadingIntroVideo, setIsUploadingIntroVideo] = useState(false);
  const [isUploadingCertificates, setIsUploadingCertificates] = useState(false);

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

  const chooseMedia = async (
    mediaType: 'photo' | 'video',
    onPick: (uri: string, name: string, type: string) => void,
  ) => {
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

  const pickImage = () => {
    chooseMedia('photo', async (uri, name, type) => {
      try {
        setIsUploadingProfileImage(true);
        const url = await uploadFile({uri, name, type});
        setProfileImage(url);
      } catch (e) {
        Alert.alert('Greška', 'Neuspešan upload slike.');
      } finally {
        setIsUploadingProfileImage(false);
      }
    });
  };

  const pickIntroVideo = () => {
    chooseMedia('video', async (uri, name, type) => {
      try {
        setIsUploadingIntroVideo(true);
        const url = await uploadFile({uri, name, type});
        setIntroVideo(url);
      } catch (e) {
        Alert.alert('Greška', 'Neuspešan upload videa.');
      } finally {
        setIsUploadingIntroVideo(false);
      }
    });
  };

  const pickCertificates = async () => {
    try {
      setIsUploadingCertificates(true);
      const results = await DocumentPicker.pickMultiple({
        type: ['image/*', 'application/pdf'],
      });

      const uploaded = await Promise.all(
        results.map(async doc => {
          const url = await uploadFile({
            uri: doc.uri,
            name: doc.name,
            type: doc.type,
          });
          return url;
        }),
      );
      setCertificates(uploaded);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Greška', 'Greška pri odabiru fajlova.');
      }
    } finally {
      setIsUploadingCertificates(false);
    }
  };

  const handleRegister = async () => {
    const resultAction = await dispatch(
      registerTrainer({
        name,
        email,
        password,
        title,
        description,
        profileImage,
        certificates,
        introVideo,
        role: 'trainer',
      }) as any,
    );

    if (registerTrainer.fulfilled.match(resultAction)) {
      Alert.alert('Uspeh', 'Trener uspešno registrovan!');
      navigation.replace('TrainerDashboard');
    } else {
      Alert.alert('Greška', resultAction.payload || 'Došlo je do greške.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#d8f24e" />
          </TouchableOpacity>

          <Text style={styles.title}>Registruj se kao trener</Text>
          <Text style={styles.welcome}>Dobrodošli</Text>
          <Text style={styles.description}>
            Podeli svoje znanje. Inspiriši druge. Tvoja trenerska karijera
            počinje ovde.
          </Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Ime</Text>
            <TextInput
              style={styles.input}
              placeholder="Unesi ime"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="example@example.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Lozinka</Text>
            <TextInput
              style={styles.input}
              placeholder="***********"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.label}>Titula</Text>
            <TextInput
              style={styles.input}
              placeholder="npr. Personalni trener"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Opis</Text>
            <TextInput
              style={styles.input}
              placeholder="Napiši nešto o sebi"
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.label}>Izaberi profilnu sliku</Text>
              {isUploadingProfileImage ? (
                <ActivityIndicator size="small" color="#1b1a1a" />
              ) : profileImage ? (
                <Image
                  source={{uri: profileImage}}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                />
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity onPress={pickIntroVideo}>
              <Text style={styles.label}>Dodaj intro video</Text>
              {isUploadingIntroVideo ? (
                <ActivityIndicator size="small" color="#1b1a1a" />
              ) : (
                <Text style={{color: '#1b1a1a', fontSize: 12}}>
                  {introVideo ? '✅ Video dodat' : 'Nema videa'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={pickCertificates}>
              <Text style={styles.label}>Dodaj sertifikate (PDF/slike)</Text>
              {isUploadingCertificates ? (
                <ActivityIndicator size="small" color="#1b1a1a" />
              ) : (
                <Text style={{color: '#1b1a1a', fontSize: 12}}>
                  {certificates.length} fajlova izabrano
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registruj se</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Već imate nalog? <Text style={styles.loginLink}>Prijavi se</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterTrainerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1a1a',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 105,
    left: 20,
  },
  title: {
    fontSize: 20,
    color: '#d8f24e',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#a58af8',
    padding: 20,
    borderRadius: 16,
    width: width - 48,
    marginBottom: 30,
  },
  label: {
    color: '#1b1a1a',
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: width - 120,
    backgroundColor: '#1b1a1a',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginText: {
    color: '#ccc',
    fontSize: 14,
  },
  loginLink: {
    color: '#d8f24e',
    fontWeight: '600',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#1b1a1a',
    paddingTop: 100,
    paddingHorizontal: 24,
    paddingBottom: 60,
    alignItems: 'center',
  },
});
