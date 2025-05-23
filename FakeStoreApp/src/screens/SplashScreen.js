import {StyleSheet, ImageBackground } from 'react-native';

export default function SplashScreen() {
  return (
    <ImageBackground
      source={require('../assets/splash.png')}
      style={styles.background}
      resizeMode="cover"
    >
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});