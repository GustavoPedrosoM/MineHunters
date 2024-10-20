// src/screens/InitialScreen.js

import React, { useState, useCallback, useContext, useEffect } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from '@react-native-community/blur';

import { GameContext } from '../context/GameContext';
import { formatTime } from '../components/Timer'; // Importar a função formatTime

const InitialScreen = ({ navigation }) => {
  const { state, loadBestTime, dispatch } = useContext(GameContext);
  const [showLevelSelection, setShowLevelSelection] = useState(false);
  const [showCompetitiveMenu, setShowCompetitiveMenu] = useState(false);
  const [showRecords, setShowRecords] = useState(false);

  const onLevelSelected = useCallback(
    (level) => {
      setShowLevelSelection(false);
      dispatch({ type: 'SET_MODE', mode: 'casual' });
      navigation.navigate('Game', { difficultLevel: level });
    },
    [dispatch, navigation]
  );

  const startCompetitiveMode = useCallback(() => {
    setShowCompetitiveMenu(true);
  }, []);

  const handleStartCompetitiveGame = useCallback(() => {
    dispatch({ type: 'SET_MODE', mode: 'competitivo' });
    setShowCompetitiveMenu(false);
    navigation.navigate('CompetitiveGame');
  }, [dispatch, navigation]);

  const cancelCompetitiveMode = useCallback(() => {
    setShowCompetitiveMenu(false);
  }, []);

  useEffect(() => {
    const loadRecords = async () => {
      await loadBestTime(0.1);
      await loadBestTime(0.2);
      await loadBestTime(0.3);
    };
    loadRecords();
  }, []); // Certifique-se de que o array de dependências está vazio para que isso ocorra apenas uma vez

  const isDialogVisible = showLevelSelection || showCompetitiveMenu || showRecords;

  return (
    <ImageBackground source={require('../assets/images/telainicial2.png')} style={styles.background}>
      {isDialogVisible && (
          <BlurView
            style={styles.blurView}
            blurType="light"
            blurAmount={1}
            reducedTransparencyFallbackColor="white"
          />
        )}
      <LinearGradient colors={['#4bcffa', '#1e90ff']} style={styles.headerContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="cog" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => setShowRecords(true)}>
          <Icon name="timer" size={35} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Botões da tela inicial */}
          <TouchableOpacity onPress={() => setShowLevelSelection(true)}>
            <LinearGradient style={[styles.buttonBase, styles.playButton]} colors={['#1e90ff', 'blue']} >
              <Text style={styles.textBase}>MODO CASUAL</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={startCompetitiveMode}>
            <LinearGradient style={[styles.buttonBase, styles.competitiveButton]}  colors={['#eb4d4b', 'red']}>
              <Text style={styles.textBase}>MODO COMPETITIVO</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Dialogs */}
        <Portal>
          {/* Seleção de Nível */}
          <Dialog
            onDismiss={() => setShowLevelSelection(false)}
            visible={showLevelSelection}
            style={styles.dialogStyle}
          >
            <Dialog.Content style={{ padding: 0 }}>
              <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
                <Dialog.Title style={styles.containerTitle}>Selecione o Nível</Dialog.Title>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => onLevelSelected(0.1)}>
                    <LinearGradient colors={['#4cd137', '#009432']} style={[styles.buttonBase, styles.levelButton]}>
                      <Text style={styles.textBase}>Fácil</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onLevelSelected(0.2)}>
                    <LinearGradient colors={['#FFC312', '#F79F1F']} style={[styles.buttonBase, styles.levelButton]}>
                      <Text style={styles.textBase}>Intermediário</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onLevelSelected(0.3)}>
                    <LinearGradient colors={['#eb4d4b', 'red']} style={[styles.buttonBase, styles.levelButton]}>
                      <Text style={styles.textBase}>Difícil</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Dialog.Content>
          </Dialog>

          {/* Menu Competitivo */}
          <Dialog
            onDismiss={cancelCompetitiveMode}
            visible={showCompetitiveMenu}
            style={styles.dialogStyle}
          >
            <Dialog.Content style={{ padding: 0 }}>
              <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
                <Dialog.Title style={styles.containerTitle}>Modo Competitivo</Dialog.Title>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleStartCompetitiveGame}>
                    <LinearGradient
                      colors={['#4cd137', '#009432']}
                      style={[styles.buttonBase, styles.startButton]}
                    >
                      <Text style={styles.textBase}>Iniciar Partida</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Dialog.Content>
          </Dialog>

          {/* Menu de Recordes */}
          <Dialog
            visible={showRecords}
            onDismiss={() => setShowRecords(false)}
            style={styles.dialogStyle}
          >
            <LinearGradient colors={['#222', 'black']} style={styles.levelDialog}>
              <Dialog.Title style={styles.containerTitle}>Recordes do Modo Casual</Dialog.Title>
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
                <Button onPress={() => setShowRecords(false)}>
                  <Text style={styles.textBase}>OK</Text>
                </Button>
              </Dialog.Actions>
            </LinearGradient>
          </Dialog>
        </Portal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Estilos base
  buttonBase: {
    width: 230,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textBase: {
    fontSize: 18,
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
    height: 55,
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
  },
  iconButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  // Estilos específicos para botões
  playButton: {
    marginBottom: 10,
  },
  competitiveButton: {
    marginBottom: 132,
  },
  levelButton: {
    marginVertical: 5,
  },
  startButton: {
    marginVertical: 5,
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
    width: 300,
  },
  containerTitle: {
    color: 'white',
    fontFamily: 'SpicyRice-Regular',
    textAlign: 'center',
  },

  // Container de botões dentro do Dialog
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 15,
  },

  // Texto do menu de recordes
  textRecords: {
    fontSize: 25,
    fontFamily: 'SpicyRice-Regular',
    padding: 5,
    marginTop: 10,
    color: 'white',
  },

  // Estilo para o BlurView
  blurView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

export default InitialScreen;
