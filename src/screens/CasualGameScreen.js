// src/screens/CasualGameScreen.js

import React, { useContext, useEffect, useRef, useState } from 'react';
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
import Header from '../components/Header';
import MineField from '../components/MineField';
import GameOverDialog from '../components/gameOverDialog';
import { flagsUsed, getMineCount, getBlockSize } from '../functions';
import params from '../params';
import MusicPlayer from '../MusicPlayer'; // Importar o MusicPlayer

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CasualGameScreen = ({ navigation, route }) => {
  const { state, dispatch, saveBestTime, loadBestTime } = useContext(GameContext);
  const timerRef = useRef();
  const [gameStarted, setGameStarted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Referência para o som do botão
  const buttonPressSoundRef = useRef(null);

  useEffect(() => {
    // Inicializar o som quando o componente for montado
    Sound.setCategory('Playback');
    buttonPressSoundRef.current = new Sound(
      require('../assets/sounds/button-press.mp3'),
      (error) => {
        if (error) {
          console.log('Erro ao carregar o som', error);
        }
      }
    );

    // Liberar o som quando o componente for desmontado
    return () => {
      if (buttonPressSoundRef.current) {
        buttonPressSoundRef.current.release();
      }
    };
  }, []);

  const playButtonSound = () => {
    if (buttonPressSoundRef.current) {
      buttonPressSoundRef.current.stop(() => {
        buttonPressSoundRef.current.play((success) => {
          if (!success) {
            console.log('Erro ao tocar o som');
          }
        });
      });
    }
  };

  const openMenu = () => {
    playButtonSound(); // Tocar som ao abrir o menu
    if (timerRef.current) {
      timerRef.current.stop();
    }
    MusicPlayer.pause(); // Pausar a música
    setMenuVisible(true);
  };

  const closeMenu = () => {
    playButtonSound(); // Tocar som ao fechar o menu
    if (timerRef.current) {
      timerRef.current.start();
    }
    MusicPlayer.play(); // Retomar a música
    setMenuVisible(false);
  };

  useEffect(() => {
    try {
      dispatch({ type: 'SET_MODE', mode: 'casual' });
      dispatch({ type: 'SET_LEVEL', level: route.params.difficultLevel });
      dispatch({ type: 'NEW_GAME' });

      setGameStarted(true);

      loadBestTime(route.params.difficultLevel);
    } catch (e) {
      console.error('Erro ao iniciar o jogo:', e);
    }
  }, [route.params.difficultLevel]);

  useEffect(() => {
    if (timerRef.current && gameStarted) {
      timerRef.current.reset();
      timerRef.current.start();
      setGameStarted(false);
    }
  }, [timerRef.current, gameStarted]);

  const handleNewGame = () => {
    playButtonSound(); // Tocar som ao iniciar novo jogo
    try {
      dispatch({ type: 'NEW_GAME' });

      setGameStarted(true);

      loadBestTime(state.level);

      // Fechar o menu de pausa
      setMenuVisible(false);

      // Retomar a música
      MusicPlayer.play();

      // Reiniciar o timer
      if (timerRef.current) {
        timerRef.current.reset();
        timerRef.current.start();
      }
    } catch (e) {
      console.error('Erro ao iniciar um novo jogo:', e);
    }
  };

  const handleExit = () => {
    playButtonSound(); // Tocar som ao sair
    MusicPlayer.play(); // Retomar a música antes de sair
    navigation.navigate('Home');
  };

  useEffect(() => {
    if (state.won || state.lost) {
      if (timerRef.current) {
        const currentTime = timerRef.current.getTime();
        timerRef.current.stop();
        if (state.won) {
          saveBestTime(state.level, currentTime);
        }
      } else {
        console.warn('timerRef.current não está definido ao parar o timer');
      }
      MusicPlayer.play(); // Retomar a música quando o jogo termina
    }
  }, [state.won, state.lost]);

  const totalMines = getMineCount(state.level);
  const flagsLeft = totalMines - flagsUsed(state.board);
  const blockSize = getBlockSize(state.level);

  return (
    <ImageBackground
      source={require('../assets/images/teladejogo4.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header
            flagsLeft={flagsLeft}
            onNewGame={handleNewGame}
            onExit={handleExit}
            timerRef={timerRef}
            onPause={openMenu}
          />
        </View>
        <View style={styles.boardContainer}>
          <View
            style={[
              styles.board,
              { width: params.boardSize, height: params.boardSize },
            ]}
          >
            <MineField
              board={state.board}
              onOpenField={(row, column) =>
                dispatch({ type: 'OPEN_FIELD', row, column })
              }
              onSelectField={(row, column) =>
                dispatch({ type: 'SELECT_FIELD', row, column })
              }
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
              onDismiss={closeMenu}
              style={styles.dialogContainer}
            >
              <LinearGradient colors={['#222', 'black']} style={styles.menu}>
                <Dialog.Title style={styles.containerTitle}>Pausado</Dialog.Title>
                <Dialog.Content>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleNewGame}>
                      <LinearGradient
                        colors={['#4cd137', '#009432']}
                        style={styles.button}
                      >
                        <Text style={styles.textButtonMenu}>Novo Jogo</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        playButtonSound();
                        MusicPlayer.play(); // Retomar a música antes de sair
                        setMenuVisible(false);
                        navigation.navigate('Home');
                      }}
                    >
                      <LinearGradient
                        colors={['#eb4d4b', 'red']}
                        style={styles.button}
                      >
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
  board: {
    // Seus estilos para o tabuleiro
  },
  dialogContainer: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    alignItems: 'center',
  },
  menu: {
    borderRadius: 20,
    width: screenWidth * 0.8,
    alignSelf: 'center',
  },
  containerTitle: {
    color: 'white',
    fontSize: screenWidth * 0.05,
    fontFamily: 'SpicyRice-Regular',
    textAlign: 'center',
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
