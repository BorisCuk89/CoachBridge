import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {registerTrainer} from '../../store/auth/authSlice.ts';
import {RootState} from '../../store/store.ts';

const RegisterTrainerScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, error} = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState(
    'https://example.com/default-profile.jpg', // Default slika ako nije dodata
  );
  const [certificates, setCertificates] = useState<string[]>([]); // Lista sertifikata

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
    <View style={styles.container}>
      <Text style={styles.title}>Registracija Trenera</Text>
      <TextInput
        placeholder="Ime"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Lozinka"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Titula (npr. Personalni trener)"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Opis"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      {/* Opcioni unos slike i sertifikata */}
      <TextInput
        placeholder="Profilna slika (URL)"
        value={profileImage}
        onChangeText={setProfileImage}
        style={styles.input}
      />
      <TextInput
        placeholder="Sertifikati (odvojeni zarezom)"
        value={certificates.join(',')}
        onChangeText={text => setCertificates(text.split(','))}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#dc3545" />
      ) : (
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Registruj se</Text>
        </TouchableOpacity>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default RegisterTrainerScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
  input: {
    width: 250,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  error: {color: 'red', marginTop: 10},
});
