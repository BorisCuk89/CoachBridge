import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addTrainingPackage} from '../../store/trainer/trainerSlice.ts';
import {RootState} from '../../store/store.ts';

const AddTrainingScreen = ({navigation}) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [videos, setVideos] = useState<
    {videoUrl: string; description: string}[]
  >([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [introVideo, setIntroVideo] = useState('');

  const handleAddVideo = () => {
    if (videoUrl && videoDescription) {
      setVideos([
        ...videos,
        {videoUrl: videoUrl, description: videoDescription},
      ]);
      setVideoUrl('');
      setVideoDescription('');
    }
  };

  const handleSubmit = () => {
    if (!title || !description || !price || videos.length === 0) {
      alert('Sva polja su obavezna');
      return;
    }

    dispatch(
      addTrainingPackage({
        trainerId: user.id || user._id,
        title,
        description,
        coverImage,
        introVideo,
        price: parseFloat(price),
        videos,
      }) as any,
    );

    alert('Trening paket uspešno dodat!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj novi trening paket</Text>

      <Text style={styles.label}>Naslov</Text>
      <TextInput
        placeholder="Naslov"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Text style={styles.label}>Opis</Text>
      <TextInput
        placeholder="Opis"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Text style={styles.label}>Cena (€)</Text>
      <TextInput
        placeholder="Cena (€)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.label}>Cover photo</Text>
      <TextInput
        placeholder="Cover photo"
        value={coverImage}
        onChangeText={setCoverImage}
        style={styles.input}
      />
      <Text style={styles.label}>Intro video</Text>
      <TextInput
        placeholder="Intro video"
        value={introVideo}
        onChangeText={setIntroVideo}
        style={styles.input}
      />

      <Text style={styles.subtitle}>Dodaj video:</Text>
      <TextInput
        placeholder="URL videa"
        value={videoUrl}
        onChangeText={setVideoUrl}
        style={styles.input}
      />
      <TextInput
        placeholder="Opis videa"
        value={videoDescription}
        onChangeText={setVideoDescription}
        style={styles.input}
      />
      <Button title="Dodaj video" onPress={handleAddVideo} />

      <FlatList
        data={videos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.videoItem}>
            <Text style={styles.videoTitle}>{item.description}</Text>
            <Text style={styles.videoUrl}>{item.videoUrl}</Text>
          </View>
        )}
      />

      <Button title="Sačuvaj trening paket" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, paddingTop: 100, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  subtitle: {fontSize: 16, fontWeight: 'bold', marginTop: 15},
  label: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  videoItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  videoTitle: {fontWeight: 'bold'},
  videoUrl: {fontSize: 12, color: '#555'},
});

export default AddTrainingScreen;
