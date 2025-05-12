import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: 'slide1',
    title: 'Start Your Journey',
    text: 'Towards A More Active Lifestyle',
    image: require('../../assets/slide1.jpg'),
    backgroundColor: '#1b1b1b',
  },
  {
    key: 'slide2',
    title: 'Find Nutrition Tips',
    text: 'That Fit Your Lifestyle',
    image: require('../../assets/slide2.jpg'),
    backgroundColor: '#1b1b1b',
  },
];

const OnboardingScreen = ({navigation}) => {
  const renderItem = ({item}) => (
    <View style={[styles.slide, {backgroundColor: item.backgroundColor}]}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );

  const onDone = () => {
    navigation.replace('Welcome');
  };

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      showSkipButton
      onSkip={onDone}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    width: Dimensions.get('window').width,
    height: '65%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 160,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  text: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 10,
  },
});

export default OnboardingScreen;
