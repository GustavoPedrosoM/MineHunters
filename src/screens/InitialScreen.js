import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity,  View, Dimensions, Text, } from 'react-native';
import { Portal, Dialog, DefaultTheme, Switch } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import Sound from 'react-native-sound';
import { Slider } from 'react-native-elements'; 

import { GameContext } from '../context/GameContext';
import { formatTime } from '../components/Timer';
import MusicPlayer from '../MusicPlayer'; 

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
  const [showSettingsMenu, setShowSettingsMenu] = useState(false); 

  // Estados para controlar as animações
  const [animationType, setAnimationType] = useState('lightSpeedOut');

  // Referência para o som do botão
  const buttonPressSoundRef = useRef(null);

  useEffect(() => {
    // Inicializar o som quando montar o componente
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

  const playButtonSound = useCallback(() => {
    if (state.isButtonSoundMuted) return; // garantir que não toque quando estiver mutado 
    if (buttonPressSoundRef.current) {
      buttonPressSoundRef.current.stop(() => {
        buttonPressSoundRef.current.play((success) => {
          if (!success) {
            console.log('Erro ao tocar o som');
          }
        });
      });
    }
  }, [state.isButtonSoundMuted]);

  // animação de todos os menus na tela inicial
  const onLevelSelected = useCallback( 
    (level) => {
      playButtonSound(); 
      setAnimationType('lightSpeedOut');
      setTimeout(() => {
        setShowLevelSelection(false);
        dispatch({ type: 'SET_MODE', mode: 'casual' });
        navigation.navigate('Game', { difficultLevel: level });
      }, 500);
    },
    [dispatch, navigation, playButtonSound]
  );

  const startCompetitiveMode = useCallback(() => { 
    playButtonSound();
    setAnimationType('slideInUp');
    setShowCompetitiveMenu(true);
  }, [playButtonSound]);

  const handleStartCompetitiveGame = useCallback(() => {
    playButtonSound(); 
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      dispatch({ type: 'SET_MODE', mode: 'competitivo' });
      setShowCompetitiveMenu(false);
      navigation.navigate('CompetitiveGame');
    }, 500);
  }, [dispatch, navigation, playButtonSound]);

  const closeCompetitiveMenu = useCallback(() => {
    playButtonSound(); 
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      setShowCompetitiveMenu(false);
    }, 500);
  }, [playButtonSound]);

  const closeModeSelection = useCallback(() => {
    playButtonSound(); 
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      setShowModeSelection(false);
    }, 500);
  }, [playButtonSound]);

  const openModeSelection = useCallback(() => {
    playButtonSound(); 
    setAnimationType('slideInUp');
    setShowModeSelection(true);
  }, [playButtonSound]);

  const closeLevelSelection = useCallback(() => {
    playButtonSound(); 
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      setShowLevelSelection(false);
    }, 500);
  }, [playButtonSound]);

  const openLevelSelection = useCallback(() => {
    playButtonSound(); 
    setAnimationType('slideInUp');
    setShowLevelSelection(true);
  }, [playButtonSound]);

  const closeRecords = useCallback(() => {
    playButtonSound(); 
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      setShowRecords(false);
    }, 500);
  }, [playButtonSound]);

  const openRecords = useCallback(() => {
    playButtonSound(); 
    setAnimationType('slideInUp');
    setShowRecords(true);
  }, [playButtonSound]);

  const openSettingsMenu = useCallback(() => {
    playButtonSound(); 
    setAnimationType('slideInUp');
    setShowSettingsMenu(true);
  }, [playButtonSound]);

  const closeSettingsMenu = useCallback(() => {
    playButtonSound(); 
    setAnimationType('lightSpeedOut');
    setTimeout(() => {
      setShowSettingsMenu(false);
    }, 500);
  }, [playButtonSound]);

  useEffect(() => { // armazenar os recordes das 3 dificuldades de jogo 
    const loadRecords = async () => {
      await loadBestTime(0.1);
      await loadBestTime(0.2);
      await loadBestTime(0.3);
    };
    loadRecords();
  }, []);

  // Atualizar o volume da musica e o estado de mute quando as configurações mudarem
  useEffect(() => {
    MusicPlayer.setVolume(state.musicVolume);
  }, [state.musicVolume]);

  useEffect(() => {
    if (state.isMusicMuted) {
      MusicPlayer.pause();
    } else {
      MusicPlayer.play();
    }
  }, [state.isMusicMuted]);

  return (
    <ImageBackground
      source={require('../assets/images/telainicial.png')}
      style={styles.background}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            playButtonSound(); 
            openSettingsMenu();
          }}>
          <LinearGradient colors={['#f9ca24', '#EE5A24']} style={styles.ConfigIcon}>
            <Icon name="cog" size={35} color="white" />
            <Text style={styles.iconsText}>Configurações</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            playButtonSound(); 
            openRecords();
          }}>
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
              playButtonSound(); 
              openModeSelection();
            }}>
            <LinearGradient style={styles.playButton} colors={['#f9ca24', '#EE5A24']}>
              <Text style={styles.textPlayButton}>Iniciar Jogo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Menu de Seleção de Modo */}
        <Portal>
          {showModeSelection && (
            <Animatable.View
              animation={animationType}
              duration={350}
              style={styles.animatableContainer}>
              <Dialog
                onDismiss={closeModeSelection}
                visible={showModeSelection}
                style={styles.dialogStyle}
                theme={customTheme} >
                <Dialog.Content style={{ padding: 0 }}>
                  <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
                    <Dialog.Title style={styles.containerTitle}>
                      Selecione o Modo de Jogo
                    </Dialog.Title>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); 
                          closeModeSelection();
                          setTimeout(() => {
                            openLevelSelection();
                          }, 500);
                        }}>
                        <LinearGradient
                          colors={['#4cd137', '#009432']}
                          style={[styles.buttonBaseMenu, styles.levelButton]}>
                          <Text style={styles.textBase}>Modo Casual</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound();
                          closeModeSelection();
                          setTimeout(() => {
                            startCompetitiveMode();
                          }, 500);
                        }}>
                        <LinearGradient
                          colors={['#eb4d4b', 'red']}
                          style={[styles.buttonBaseMenu, styles.levelButton]}>
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
              style={styles.animatableContainer}>
              <Dialog
                onDismiss={closeLevelSelection}
                visible={showLevelSelection}
                style={styles.dialogStyle}
                theme={customTheme} >
                <Dialog.Content style={{ padding: 0 }}>
                  <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
                    <Dialog.Title style={styles.containerTitle}>
                      Selecione o Nível
                    </Dialog.Title>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); 
                          onLevelSelected(0.1);
                        }}>
                        <LinearGradient
                          colors={['#4cd137', '#009432']}
                          style={[styles.buttonBaseMenu, styles.levelButton]}>
                          <Text style={styles.textBase}>Fácil</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); 
                          onLevelSelected(0.2);
                        }}>
                        <LinearGradient
                          colors={['#FFC312', '#F79F1F']}
                          style={[styles.buttonBaseMenu, styles.levelButton]}>
                          <Text style={styles.textBase}>Intermediário</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); 
                          onLevelSelected(0.3);
                        }}>
                        <LinearGradient
                          colors={['#eb4d4b', 'red']}
                          style={[styles.buttonBaseMenu, styles.levelButton]}>
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
              style={styles.animatableContainer}>
              <Dialog
                onDismiss={closeCompetitiveMenu}
                visible={showCompetitiveMenu}
                style={styles.dialogStyle}
                theme={customTheme} >
                <Dialog.Content style={{ padding: 0 }}>
                  <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
                    <Dialog.Title style={styles.containerTitle}>
                      Modo Competitivo
                    </Dialog.Title>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          playButtonSound(); 
                          handleStartCompetitiveGame();
                        }}>
                        <LinearGradient
                          colors={['#4cd137', '#009432']}
                          style={[styles.buttonBaseMenu, styles.startButton]}>
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
              style={styles.animatableContainer}>
              <Dialog
                visible={showRecords}
                onDismiss={closeRecords}
                style={styles.dialogStyle}
                theme={customTheme}>
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
                </LinearGradient>
              </Dialog>
            </Animatable.View>
          )}

          {/* Menu de Configurações */}
          {showSettingsMenu && (
            <Animatable.View
              animation={animationType}
              duration={350}
              style={styles.animatableContainer}>
              <Dialog
                onDismiss={closeSettingsMenu}
                visible={showSettingsMenu}
                style={styles.dialogStyle}
                theme={customTheme}>
                <Dialog.Content style={{ padding: 0 }}>
                  <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
                    <Dialog.Title style={styles.containerTitle}>
                      Configurações
                    </Dialog.Title>
                    <View style={styles.settingsContainer}>
                      {/* Opção para mutar o som dos botões */}
                      <View style={styles.settingItem}>
                        <Text style={styles.textBase}>Som dos Botões</Text>
                        <Switch
                          value={!state.isButtonSoundMuted}
                          onValueChange={() => {
                            dispatch({ type: 'TOGGLE_BUTTON_SOUND' });
                          }}
                        />
                      </View>
                      {/* Opção para mutar a música do jogo */}
                      <View style={styles.settingItem}>
                        <Text style={styles.textBase}>Música do Jogo</Text>
                        <Switch
                          value={!state.isMusicMuted}
                          onValueChange={() => {
                            dispatch({ type: 'TOGGLE_MUSIC' });
                          }}
                        />
                      </View>
                      {/* Controle de volume da música*/}
                      <View style={styles.settingItem}>
                        <Text style={styles.textBase}>Volume da Música</Text>
                        <Slider
                          value={state.musicVolume}
                          onValueChange={(value) => {
                            dispatch({ type: 'SET_MUSIC_VOLUME', volume: value });
                          }}
                          minimumValue={0}
                          maximumValue={1}
                          step={0.01}
                          minimumTrackTintColor="#FFFFFF"
                          maximumTrackTintColor="#000000"
                          thumbTintColor="#f9ca24"
                          style={{ width: screenWidth * 0.6 }}
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </Dialog.Content>
              </Dialog>
            </Animatable.View>
          )}
        </Portal>
      </View>
    </ImageBackground>
  );
};

// Obter as dimensoes da tela
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
    marginTop: screenHeight * 0.03,
    fontSize: screenWidth * 0.046,
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
    fontSize: screenWidth * 0.055,
    fontFamily: 'SpicyRice-Regular',
    padding: screenWidth * 0.02,
    marginTop: screenHeight * 0.01,
    color: 'white',
  },

  // Estilo para o container de animação
  animatableContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Estilos do menu de configurações
  settingsContainer: {
    padding: screenWidth * 0.05,
  },
  settingItem: {
    marginVertical: screenHeight * 0.01,
  },
});

export default InitialScreen;
