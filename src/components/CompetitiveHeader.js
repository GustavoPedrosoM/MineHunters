// src/components/CompetitiveHeader.js

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Portal, Dialog } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Flag from './Flag';
import Timer from './Timer';
import LinearGradient from 'react-native-linear-gradient';

// Obter as dimensões da tela
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CompetitiveHeader = ({
  flagsLeft,
  onNewGame,
  onExit,
  onFlagPress,
  timerRef,
  countdown,
  onCountdownFinish,
  ranking,
  victoriesCount,
  score, // Receber a pontuação atual
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => {
    if (timerRef.current && (ranking === 'Especialista' || ranking === 'Rei do Campo Minado')) {
      timerRef.current.stop();
    }
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    if (timerRef.current && (ranking === 'Especialista' || ranking === 'Rei do Campo Minado')) {
      timerRef.current.start();
    }
  };

  const handleNewGame = () => {
    setMenuVisible(false);
    onNewGame();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f9ca24', '#EE5A24']} style={styles.rankingContainer}>
        <View style={styles.timerAndRankingContainer}>
          <Text style={styles.rankingText}>Ranking: {ranking}</Text>
            {ranking === 'Rei do Campo Minado' ? (
              <Text style={styles.scoreText}>Pontuação: {score}</Text>
              ) : (
            <Text style={styles.victoriesText}>Vitórias: {victoriesCount}</Text>
              )}
            {/* Renderizar o Timer apenas se o ranking for 'Especialista' ou 'Rei do Campo Minado' */}
            {(ranking === 'Especialista' || ranking === 'Rei do Campo Minado') && (
              <Timer
                ref={timerRef}
                countdown={countdown}
                onCountdownFinish={onCountdownFinish}
              />
              )}
            </View>
              
        <TouchableOpacity onPress={onFlagPress} style={styles.flagContainer}>
            <View style={styles.flagGradient}>
              <Flag bigger={true} />
              <Text style={styles.flagsText}>= {flagsLeft}</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={openMenu}>
          <View style={styles.buttonPause}>
            <Icon name="pause-circle" size={screenWidth * 0.08} color="white" />
          </View>
        </TouchableOpacity>
      </LinearGradient>
      

      {menuVisible && (
        <Portal>
          <Dialog visible={menuVisible} onDismiss={closeMenu} style={styles.dialogContainer}>
            <LinearGradient colors={['#222', 'black']} style={styles.menu}>
              <Dialog.Title style={styles.containerTitle}>Pausado</Dialog.Title>
              <Dialog.Content>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleNewGame}>
                    <LinearGradient colors={['#4cd137', '#009432']} style={styles.button}>
                      <Text style={styles.textButtonMenu}>Novo Jogo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onExit}>
                    <LinearGradient colors={['#eb4d4b', 'red']} style={styles.button}>
                      <Text style={styles.textButtonMenu}>Menu Principal</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Dialog.Content>
            </LinearGradient>
          </Dialog>
        </Portal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: screenWidth * 0.02,
    height: screenHeight * 0.2,
  },

  // estilos da bandeira
  flagContainer: {
    alignItems: 'center',
  },
  flagGradient: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagsText: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'SpicyRice-Regular',
    color: 'white',
    marginLeft: screenWidth * 0.01,
  },

  // estilos do timer
  timerAndRankingContainer: {
    alignItems: 'center',
  },

  // estilos do ranking 
  rankingContainer: {
    paddingHorizontal: screenWidth * 0.08,
    paddingVertical: screenHeight * 0.008,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankingText: {
    fontSize: screenWidth * 0.045,
    color: '#FFF',
    fontFamily: 'SpicyRice-Regular',
  },
  victoriesText: {
    fontSize: screenWidth * 0.035,
    color: '#FFF',
    fontFamily: 'SpicyRice-Regular',
  },

  // estilo da pontuação de ranking
  scoreText: {
    fontSize: screenWidth * 0.035,
    color: 'white', 
    fontFamily: 'SpicyRice-Regular',
  },

  // estilo do icone de pause
  buttonPause: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  dialogContainer: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    alignItems: 'center',
  },
  menu: {
    borderRadius: 20,
    overflow: 'hidden',
    width: screenWidth * 0.8,
    alignSelf: 'center',
  },
  containerTitle: {
    color: 'white',
    fontFamily: 'SpicyRice-Regular',
    textAlign: 'center',
    fontSize: screenWidth * 0.05,
  },
  buttonContainer: {
    marginTop: screenHeight * 0.02,
  },
  button: {
    width: screenWidth * 0.6,
    height: screenHeight * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: screenHeight * 0.01,
    alignSelf: 'center',
  },
  textButtonMenu: {
    fontSize: screenWidth * 0.045,
    color: 'white',
    fontFamily: 'SpicyRice-Regular',
  },
  buttonCancel: {
    alignSelf: 'center',
  },
});

export default CompetitiveHeader;
