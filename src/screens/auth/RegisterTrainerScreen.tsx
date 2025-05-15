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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {registerTrainer} from '../../store/auth/authSlice.ts';
import {RootState} from '../../store/store.ts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native';

const {width} = Dimensions.get('window');

const RegisterTrainerScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, error} = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState(
    'https://example.com/default-profile.jpg',
  );
  const [certificates, setCertificates] = useState<string[]>([]);

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
          {/* Strelica za nazad */}
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

          {/* Forma */}
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

            <Text style={styles.label}>Profilna slika (URL)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/slika.jpg"
              placeholderTextColor="#888"
              value={profileImage}
              onChangeText={setProfileImage}
            />

            <Text style={styles.label}>Sertifikati (odvojeni zarezom)</Text>
            <TextInput
              style={styles.input}
              placeholder="sertifikat1.pdf, sertifikat2.pdf"
              placeholderTextColor="#888"
              value={certificates.join(',')}
              onChangeText={text => setCertificates(text.split(','))}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Dugme */}
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

          {/* Link za login */}
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
