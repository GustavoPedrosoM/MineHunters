// src/components/CompetitiveHeader.js

import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Portal, Dialog } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Flag from './Flag';
import Timer from './Timer';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import MusicPlayer from '../MusicPlayer';
import { GameContext } from '../context/GameContext'; // Importar GameContext

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CompetitiveHeader = ({
  flagsLeft,
  onExit,
  timerRef,
  countdown,
  onCountdownFinish,
  ranking,
  victoriesCount,
  score,
}) => {
  const { state } = useContext(GameContext); // Obter o estado do contexto
  const [menuVisible, setMenuVisible] = useState(false);
  const buttonPressSoundRef = useRef(null);

  useEffect(() => {
    Sound.setCategory('Playback');
    buttonPressSoundRef.current = new Sound(
      require('../assets/sounds/button-press.mp3'),
      (error) => {
        if (error) console.log('Erro ao carregar o som', error);
      }
    );

    return () => buttonPressSoundRef.current?.release();
  }, []);

  const playButtonSound = useCallback(() => {
    buttonPressSoundRef.current?.stop(() => {
      buttonPressSoundRef.current?.play((success) => {
        if (!success) console.log('Erro ao tocar o som');
      });
    });
  }, []);

  const openMenu = () => {
    if (timerRef.current && (ranking === 'Especialista' || ranking === 'Rei do Campo Minado')) {
      timerRef.current.stop();
    }
    setMenuVisible(true);
    if (!state.isMusicMuted) MusicPlayer.pause(); // Pausar a música se não estiver em modo mudo
  };

  const closeMenu = () => {
    setMenuVisible(false);
    if (timerRef.current && (ranking === 'Especialista' || ranking === 'Rei do Campo Minado')) {
      timerRef.current.start();
    }
    if (!state.isMusicMuted) MusicPlayer.play(); // Retomar a música se não estiver em modo mudo
  };

  const handleExitFromMenu = () => {
    playButtonSound();
    if (!state.isMusicMuted) MusicPlayer.play(); // Retomar a música antes de sair se não estiver em modo mudo
    onExit();
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
          {(ranking === 'Especialista' || ranking === 'Rei do Campo Minado') && (
            <Timer
              ref={timerRef}
              countdown={countdown}
              onCountdownFinish={onCountdownFinish}
            />
          )}
        </View>

        <View style={styles.flagContainer}>
          <View style={styles.flagGradient}>
            <Flag bigger={true} />
            <Text style={styles.flagsText}>= {flagsLeft}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            playButtonSound();
            openMenu();
          }}
        >
          <View style={styles.buttonPause}>
            <Icon name="pause-circle" size={screenWidth * 0.08} color="white" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {menuVisible && (
        <Portal>
          <Dialog visible={menuVisible} onDismiss={closeMenu} style={styles.dialogContainer}>
            <LinearGradient colors={['#222', 'black']} style={styles.menu}>
              <Dialog.Title style={styles.containerTitle}>Em pause</Dialog.Title>
              <Dialog.Content>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      playButtonSound();
                      closeMenu();
                    }}
                  >
                    <LinearGradient colors={['#4cd137', '#009432']} style={styles.button}>
                      <Text style={styles.textButtonMenu}>Continuar Jogando</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleExitFromMenu}>
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
  timerAndRankingContainer: {
    alignItems: 'center',
  },
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
  scoreText: {
    fontSize: screenWidth * 0.035,
    color: 'white',
    fontFamily: 'SpicyRice-Regular',
  },
  buttonPause: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: screenWidth * 0.02,
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
    height: screenWidth * 0.5,
    alignSelf: 'center',
  },
  containerTitle: {
    color: 'white',
    fontFamily: 'SpicyRice-Regular',
    textAlign: 'center',
    fontSize: screenWidth * 0.046,
    marginTop: screenHeight * 0.03,
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
});

export default CompetitiveHeader;
