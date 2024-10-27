// src/screens/InitialScreen.js

import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Button, Dialog, Portal, Text, DefaultTheme } from 'react-native-paper'; // Importar DefaultTheme
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable'; // Importar o react-native-animatable
import Sound from 'react-native-sound'; // Importar o react-native-sound

import { GameContext } from '../context/GameContext';
import { formatTime } from '../components/Timer'; // Importar a função formatTime

// Criar o tema personalizado
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    backdrop: 'transparent', // Tornar o backdrop transparente
  },
};

const InitialScreen = ({ navigation }) => {
  const { state, loadBestTime, dispatch } = useContext(GameContext);
  const [showLevelSelection, setShowLevelSelection] = useState(false);
  const [showCompetitiveMenu, setShowCompetitiveMenu] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);

  // Estados para controlar as animações
  const [animationType, setAnimationType] = useState('lightSpeedOut');

  // Referência para o som do botão
  const buttonPressSoundRef = useRef(null);

  useEffect(() => {
    // Inicializar o som quando o componente for montado
    Sound.setCategory('Playback');
    buttonPressSoundRef.current = new Sound(
      require('../assets/sounds/button-press2.mp3'),
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

  const onLevelSelected = useCallback(
    (level) => {
      playButtonSound(); // Tocar som ao selecionar o nível
      setAnimationType('lightSpeedOut');
      setTimeout(() => {
        setShowLevelSelection(false);
        dispatch({ type: 'SET_MODE', mode: 'casual' });
        navigation.navigate('Game', { difficultLevel: level });
      }, 500);
    },
    [dispatch, navigation]
  );

  const startCompetitiveMode = useCallback(() => {
    playButtonSound(); // Tocar som ao iniciar o modo competitivo
    setAnimationType('slideInUp');
    setShowCompetitiveMenu(true);
  }, []);

  const handleStartCompetitiveGame = useCallback(() => {
    playButtonSound(); // Tocar som ao iniciar o jogo competitivo
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      dispatch({ type: 'SET_MODE', mode: 'competitivo' });
      setShowCompetitiveMenu(false);
      navigation.navigate('CompetitiveGame');
    }, 500);
  }, [dispatch, navigation]);

  const closeCompetitiveMenu = useCallback(() => {
    playButtonSound(); // Tocar som ao fechar o menu competitivo
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      setShowCompetitiveMenu(false);
    }, 500);
  }, []);

  const closeModeSelection = useCallback(() => {
    playButtonSound(); // Tocar som ao fechar a seleção de modo
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      setShowModeSelection(false);
    }, 500);
  }, []);

  const openModeSelection = useCallback(() => {
    playButtonSound(); // Tocar som ao abrir a seleção de modo
    setAnimationType('slideInUp');
    setShowModeSelection(true);
  }, []);

  const closeLevelSelection = useCallback(() => {
    playButtonSound(); // Tocar som ao fechar a seleção de nível
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      setShowLevelSelection(false);
    }, 500);
  }, []);

  const openLevelSelection = useCallback(() => {
    playButtonSound(); // Tocar som ao abrir a seleção de nível
    setAnimationType('slideInUp');
    setShowLevelSelection(true);
  }, []);

  const closeRecords = useCallback(() => {
    playButtonSound(); // Tocar som ao fechar o menu de recordes
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      setShowRecords(false);
    }, 500);
  }, []);

  const openRecords = useCallback(() => {
    playButtonSound(); // Tocar som ao abrir o menu de recordes
    setAnimationType('slideInUp');
    setShowRecords(true);
  }, []);

  useEffect(() => {
    const loadRecords = async () => {
      await loadBestTime(0.1);
      await loadBestTime(0.2);
      await loadBestTime(0.3);
    };
    loadRecords();
  }, []);

  const isDialogVisible =
    showLevelSelection || showCompetitiveMenu || showRecords || showModeSelection;

  // Obter as dimensões da tela
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  return (
    <ImageBackground
      source={require('../assets/images/telainicial5.png')}
      style={styles.background}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            playButtonSound(); // Tocar som ao pressionar o botão
            // Ação do botão de configurações (adicione aqui se houver)
          }}
        >
          <LinearGradient colors={['#f9ca24', '#EE5A24']} style={styles.ConfigIcon}>
            <Icon name="cog" size={35} color="white" />
            <Text style={styles.iconsText}>Configurações</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            playButtonSound(); // Tocar som ao pressionar o botão
            openRecords();
          }}
        >
          <LinearGradient colors={['#f9ca24', '#EE5A24']} style={styles.RecordIcon}>
            <Icon name="timer" size={35} color="white" />
            <Text style={styles.iconsText}>Recordes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Botão Jogar */}
          <TouchableOpacity
            onPress={() => {
              playButtonSound(); // Tocar som ao pressionar o botão
              openModeSelection();
            }}
          >
            <LinearGradient style={styles.playButton} colors={['#f9ca24', '#EE5A24']}>
              <Text style={styles.textPlayButton}>Iniciar Jogo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Menus com Animações */}
        <Portal>
          {/* Menu de Seleção de Modo */}
          {showModeSelection && (
            <Animatable.View
              animation={animationType}
              duration={350}
              style={styles.animatableContainer}
            >
              <Dialog
                onDismiss={closeModeSelection}
                visible={showModeSelection}
                style={styles.dialogStyle}
                theme={customTheme} // Aplicar o tema personalizado
              >
                <Dialog.Content style={{ padding: 0 }}>
                  <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
                    <Dialog.Title style={styles.containerTitle}>
                      Selecione o Modo de Jogo
                    </Dialog.Title>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); // Tocar som ao pressionar o botão
                          closeModeSelection();
                          setTimeout(() => {
                            openLevelSelection();
                          }, 500);
                        }}
                      >
                        <LinearGradient
                          colors={['#4cd137', '#009432']}
                          style={[styles.buttonBaseMenu, styles.levelButton]}
                        >
                          <Text style={styles.textBase}>Modo Casual</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); // Tocar som ao pressionar o botão
                          closeModeSelection();
                          setTimeout(() => {
                            startCompetitiveMode();
                          }, 500);
                        }}
                      >
                        <LinearGradient
                          colors={['#eb4d4b', 'red']}
                          style={[styles.buttonBaseMenu, styles.levelButton]}
                        >
                          <Text style={styles.textBase}>Modo Competitivo</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </Dialog.Content>
              </Dialog>
            </Animatable.View>
          )}

          {/* Seleção de Nível */}
          {showLevelSelection && (
            <Animatable.View
              animation={animationType}
              duration={350}
              style={styles.animatableContainer}
            >
              <Dialog
                onDismiss={closeLevelSelection}
                visible={showLevelSelection}
                style={styles.dialogStyle}
                theme={customTheme} // Aplicar o tema personalizado
              >
                <Dialog.Content style={{ padding: 0 }}>
                  <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
                    <Dialog.Title style={styles.containerTitle}>Selecione o Nível</Dialog.Title>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); // Tocar som ao pressionar o botão
                          onLevelSelected(0.1);
                        }}
                      >
                        <LinearGradient
                          colors={['#4cd137', '#009432']}
                          style={[styles.buttonBaseMenu, styles.levelButton]}
                        >
                          <Text style={styles.textBase}>Fácil</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); // Tocar som ao pressionar o botão
                          onLevelSelected(0.2);
                        }}
                      >
                        <LinearGradient
                          colors={['#FFC312', '#F79F1F']}
                          style={[styles.buttonBaseMenu, styles.levelButton]}
                        >
                          <Text style={styles.textBase}>Intermediário</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); // Tocar som ao pressionar o botão
                          onLevelSelected(0.3);
                        }}
                      >
                        <LinearGradient
                          colors={['#eb4d4b', 'red']}
                          style={[styles.buttonBaseMenu, styles.levelButton]}
                        >
                          <Text style={styles.textBase}>Difícil</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </Dialog.Content>
              </Dialog>
            </Animatable.View>
          )}

          {/* Menu Competitivo */}
          {showCompetitiveMenu && (
            <Animatable.View
              animation={animationType}
              duration={350}
              style={styles.animatableContainer}
            >
              <Dialog
                onDismiss={closeCompetitiveMenu}
                visible={showCompetitiveMenu}
                style={styles.dialogStyle}
                theme={customTheme} // Aplicar o tema personalizado
              >
                <Dialog.Content style={{ padding: 0 }}>
                  <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
                    <Dialog.Title style={styles.containerTitle}>Modo Competitivo</Dialog.Title>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); // Tocar som ao pressionar o botão
                          handleStartCompetitiveGame();
                        }}
                      >
                        <LinearGradient
                          colors={['#4cd137', '#009432']}
                          style={[styles.buttonBaseMenu, styles.startButton]}
                        >
                          <Text style={styles.textBase}>Iniciar Partida</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </Dialog.Content>
              </Dialog>
            </Animatable.View>
          )}

          {/* Menu de Recordes */}
          {showRecords && (
            <Animatable.View
              animation={animationType}
              duration={350}
              style={styles.animatableContainer}
            >
              <Dialog
                visible={showRecords}
                onDismiss={closeRecords}
                style={styles.dialogStyle}
                theme={customTheme} // Aplicar o tema personalizado
              >
                <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
                  <Dialog.Title style={styles.containerTitle}>
                    Recordes do Modo Casual
                  </Dialog.Title>
                  <Dialog.Content>
                    <Text style={[styles.textRecords, { color: '#009432' }]}>
                      Fácil: {formatTime(state.bestTimes?.easy)}
                    </Text>
                    <Text style={[styles.textRecords, { color: '#F79F1F' }]}>
                      Intermediário: {formatTime(state.bestTimes?.medium)}
                    </Text>
                    <Text style={[styles.textRecords, { color: 'red' }]}>
                      Difícil: {formatTime(state.bestTimes?.hard)}
                    </Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button
                      onPress={() => {
                        playButtonSound(); // Tocar som ao pressionar o botão
                        closeRecords();
                      }}
                    >
                      <Text style={styles.OkButton}>OK</Text>
                    </Button>
                  </Dialog.Actions>
                </LinearGradient>
              </Dialog>
            </Animatable.View>
          )}
        </Portal>
      </View>
    </ImageBackground>
  );
};

// Obter as dimensões da tela
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Estilos base
  playButton: {
    width: screenWidth * 0.5,
    height: screenHeight * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: screenHeight * 0.23,
  },
  buttonBaseMenu: {
    width: screenWidth * 0.5,
    height: screenHeight * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textPlayButton: {
    fontSize: screenWidth * 0.06,
    fontFamily: 'SpicyRice-Regular',
    color: 'white',
  },
  textBase: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'SpicyRice-Regular',
    color: 'white',
  },
  OkButton: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'SpicyRice-Regular',
    color: 'white',
  },
  // Tela inicial
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  // Cabeçalho
  headerContainer: {
    width: '100%',
    height: screenHeight * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
    marginTop: screenHeight * 0.005,
  },
  ConfigIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: screenWidth * 0.02,
    height: screenHeight * 0.06,
    backgroundColor: 'transparent',
  },
  RecordIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: screenWidth * 0.02,
    height: screenHeight * 0.06,
    backgroundColor: 'transparent',
  },
  iconsText: {
    color: 'white',
    marginLeft: screenWidth * 0.01,
    fontFamily: 'SpicyRice-Regular',
    fontSize: screenWidth * 0.04,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Estilos específicos para botões
  levelButton: {
    marginVertical: screenHeight * 0.01,
  },
  startButton: {
    marginVertical: screenHeight * 0.01,
  },
  // Estilos dos Dialogs
  dialogStyle: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    alignItems: 'center',
  },
  levelDialog: {
    borderRadius: 20,
    overflow: 'hidden',
    width: screenWidth * 0.8,
  },
  containerTitle: {
    color: 'white',
    fontFamily: 'SpicyRice-Regular',
    textAlign: 'center',
    fontSize: screenWidth * 0.05,
    marginTop: screenHeight * 0.02,
  },

  // Container de botões dentro do Dialog
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: screenHeight * 0.02,
    marginTop: screenHeight * 0.01,
    marginBottom: screenHeight * 0.02,
  },

  // Texto do menu de recordes
  textRecords: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'SpicyRice-Regular',
    padding: screenWidth * 0.02,
    marginTop: screenHeight * 0.01,
    color: 'white',
  },

  // Estilo para o contêiner animável
  animatableContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InitialScreen;
