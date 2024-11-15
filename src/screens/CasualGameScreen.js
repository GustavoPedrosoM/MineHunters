// src/screens/CasualGameScreen.js

import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Portal, Dialog, Text } from 'react-native-paper';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';

import { GameContext } from '../context/GameContext';
import Header from '../components/CasualHeader';
import MineField from '../components/MineField';
import GameOverDialog from '../components/GameOverDialog';
import { flagsUsed, getMineCount, getBlockSize, boardSize } from '../functions';
import MusicPlayer from '../MusicPlayer';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CasualGameScreen = ({ navigation, route }) => {
  const { state, dispatch, saveBestTime, loadBestTime } = useContext(GameContext);
  const timerRef = useRef();
  const buttonPressSoundRef = useRef(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

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
    if (!state.isButtonSoundMuted && buttonPressSoundRef.current) {
      buttonPressSoundRef.current.stop(() => {
        buttonPressSoundRef.current.play((success) => {
          if (!success) console.log('Erro ao tocar o som');
        });
      });
    }
  }, [state.isButtonSoundMuted]);

  useEffect(() => {
    if (!gameStarted) {
      dispatch({ type: 'SET_MODE', mode: 'casual' });
      dispatch({ type: 'SET_LEVEL', level: route.params.difficultLevel });
      dispatch({ type: 'NEW_GAME' });
      loadBestTime(route.params.difficultLevel);
      setGameStarted(true);
    }
  }, [dispatch, route.params.difficultLevel, loadBestTime, gameStarted]);

  useEffect(() => {
    if (timerRef.current) {
      timerRef.current.reset();
      timerRef.current.start();
    }
  }, [gameStarted]);

  const handleNewGame = useCallback(() => {
    playButtonSound();
    dispatch({ type: 'NEW_GAME' });
    loadBestTime(state.level);
    setGameStarted(false);
    setMenuVisible(false);
    if (!state.isMusicMuted) MusicPlayer.play();

    timerRef.current?.reset();
    timerRef.current?.start();
  }, [dispatch, loadBestTime, playButtonSound, state.level, state.isMusicMuted]);

  const handleExit = useCallback(() => {
    playButtonSound();
    if (!state.isMusicMuted) MusicPlayer.play();
    navigation.navigate('Home');
  }, [playButtonSound, navigation, state.isMusicMuted]);

  useEffect(() => {
    if (state.won || state.lost) {
      const currentTime = timerRef.current?.getTime();
      timerRef.current?.stop();
      if (state.won) saveBestTime(state.level, currentTime);
      if (!state.isMusicMuted) MusicPlayer.play();
    }
  }, [state.won, state.lost, saveBestTime, state.level, state.isMusicMuted]);

  // Adicionar este useEffect para reiniciar o timer e a música quando o menu é fechado
  useEffect(() => {
    if (!menuVisible) {
      timerRef.current?.start();
      if (!state.isMusicMuted) MusicPlayer.play();
    }
  }, [menuVisible, state.isMusicMuted]);

  const totalMines = getMineCount(state.level);
  const flagsLeft = totalMines - flagsUsed(state.board);
  const blockSize = getBlockSize(state.level);

  return (
    <ImageBackground
      source={require('../assets/images/teladejogo.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header
            flagsLeft={flagsLeft}
            onNewGame={handleNewGame}
            onExit={handleExit}
            timerRef={timerRef}
            onPause={() => {
              playButtonSound();
              timerRef.current?.stop();
              MusicPlayer.pause();
              setMenuVisible(true);
            }}
          />
        </View>
        <View style={styles.boardContainer}>
          <View style={[styles.board, { width: boardSize, height: boardSize }]}>
            <MineField
              board={state.board}
              onOpenField={(row, column) => dispatch({ type: 'OPEN_FIELD', row, column })}
              onSelectField={(row, column) => dispatch({ type: 'SELECT_FIELD', row, column })}
              blockSize={blockSize}
            />
          </View>
        </View>
        <GameOverDialog
          isVisible={state.gameOverVisible}
          onCancel={() => dispatch({ type: 'TOGGLE_GAME_OVER' })}
          onNewGame={handleNewGame}
          onExit={handleExit}
          isWin={state.isWin}
        />
      </View>
      {menuVisible && (
        <>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={1}
            reducedTransparencyFallbackColor="white"
          />
          <Portal>
            <Dialog
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              style={styles.dialogContainer}
            >
              <LinearGradient colors={['#222', 'black']} style={styles.menu}>
                <Dialog.Title style={styles.containerTitle}>Em pause</Dialog.Title>
                <Dialog.Content>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleNewGame}>
                      <LinearGradient colors={['#4cd137', '#009432']} style={styles.button}>
                        <Text style={styles.textButtonMenu}>Novo Jogo</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        playButtonSound();
                        if (!state.isMusicMuted) MusicPlayer.play();
                        setMenuVisible(false);
                        navigation.navigate('Home');
                      }}
                    >
                      <LinearGradient colors={['#eb4d4b', 'red']} style={styles.button}>
                        <Text style={styles.textButtonMenu}>Menu Principal</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </Dialog.Content>
              </LinearGradient>
            </Dialog>
          </Portal>
        </>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  boardContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    alignItems: 'center',
  },
  menu: {
    borderRadius: 20,
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  containerTitle: {
    color: 'white',
    fontSize: screenWidth * 0.046,
    fontFamily: 'SpicyRice-Regular',
    textAlign: 'center',
    marginTop: screenHeight * 0.02,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: screenHeight * 0.02,
  },
  button: {
    width: screenWidth * 0.6,
    height: screenHeight * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: screenHeight * 0.015,
  },
  textButtonMenu: {
    color: 'white',
    fontSize: screenWidth * 0.045,
    fontFamily: 'SpicyRice-Regular',
  },
});

export default CasualGameScreen;
