// src/components/Header.js

import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Flag from './Flag';
import Timer from './Timer';
import LinearGradient from 'react-native-linear-gradient';
import { GameContext } from '../context/GameContext';

const Header = ({ flagsLeft, onNewGame, onExit, timerRef, onPause }) => {
  console.log('Header.js re-render');

  const { state } = useContext(GameContext);

  // Obter as dimensões da tela
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {/* Remover o onPress do TouchableOpacity */}
      <View style={styles.flagContainer}>
        <LinearGradient colors={['#f9ca24', '#EE5A24']} style={styles.flagGradient}>
          <Flag bigger={true} />
          <Text style={styles.flagsText}>= {flagsLeft}</Text>
        </LinearGradient>
      </View>

      <LinearGradient colors={['#f9ca24', '#EE5A24']} style={styles.timerContainer}>
        <Timer ref={timerRef} />
      </LinearGradient>

      <TouchableOpacity onPress={onPause}>
        <LinearGradient colors={['#f9ca24', '#EE5A24']} style={styles.buttonPause}>
          <Icon name="pause-circle" size={screenWidth * 0.08} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// Obter as dimensões da tela
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.02,
    height: screenHeight * 0.1,
    justifyContent: 'space-around',
  },
  flagContainer: {
    alignItems: 'center',
  },
  flagGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.007,
  },
  flagsText: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'SpicyRice-Regular',
    color: 'white',
    marginLeft: screenWidth * 0.01,
  },
  timerContainer: {
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: screenHeight * 0.005,
    paddingHorizontal: screenWidth * 0.03,
  },
  buttonPause: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: screenHeight * 0.006,
    paddingHorizontal: screenWidth * 0.03,
  },
});

export default Header;
