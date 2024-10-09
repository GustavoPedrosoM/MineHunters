import React, { useState, useCallback, useContext, useEffect } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from '@react-native-community/blur'; 

import { GameContext } from '../context/GameContext';

const InitialScreen = ({ navigation }) => {
  const { loadBestTime, dispatch } = useContext(GameContext);
  const [showLevelSelection, setShowLevelSelection] = useState(false);
  const [showCompetitiveMenu, setShowCompetitiveMenu] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [records, setRecords] = useState({
    easy: 'N/A',
    medium: 'N/A',
    hard: 'N/A',
  });

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
      const easy = await loadBestTime(0.1);
      const medium = await loadBestTime(0.2);
      const hard = await loadBestTime(0.3);
      setRecords({
        easy: easy !== null ? `${easy}s` : 'N/A',
        medium: medium !== null ? `${medium}s` : 'N/A',
        hard: hard !== null ? `${hard}s` : 'N/A',
      });
    };
    loadRecords();
  }, []); 

  const isDialogVisible = showLevelSelection || showCompetitiveMenu || showRecords;

  return (
    <ImageBackground source={require('../assets/images/Telainicial.png')} style={styles.background}>
      <LinearGradient colors={['#72a34d', '#527a33']} style={styles.headerContainer}>
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
            <LinearGradient style={[styles.buttonBase, styles.playButton]} colors={['#D6A2E8', '#8c7ae6']}>
              <Text style={styles.textBase}>MODO CASUAL</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={startCompetitiveMode}>
            <LinearGradient style={[styles.buttonBase, styles.competitiveButton]} colors={['#ffbe76', '#f0932b']}>
              <Text style={styles.textBase}>MODO COMPETITIVO</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {isDialogVisible && (
          <BlurView
            style={styles.blurView}
            blurType="light" 
            blurAmount={2}
            reducedTransparencyFallbackColor="white" 
          />
        )}

        {/* Dialogs */}
        <Portal>
          {/* Seleção de Nível */}
          <Dialog
            onDismiss={() => setShowLevelSelection(false)}
            visible={showLevelSelection}
            style={styles.dialogStyle}
          >
            <Dialog.Content style={{ padding: 0 }}>
              <LinearGradient colors={['#2f3640', '#222']} style={styles.levelDialog}>
                <Dialog.Title style={styles.containerTitle}>Selecione o Nível</Dialog.Title>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => onLevelSelected(0.1)}>
                    <LinearGradient colors={['#72a34d', '#527a33']} style={[styles.buttonBase, styles.levelButton]}>
                      <Text style={styles.textBase}>Fácil</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onLevelSelected(0.2)}>
                    <LinearGradient colors={['#fa983a', '#e58e26']} style={[styles.buttonBase, styles.levelButton]}>
                      <Text style={styles.textBase}>Intermediário</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onLevelSelected(0.3)}>
                    <LinearGradient colors={['#e55039', '#b33939']} style={[styles.buttonBase, styles.levelButton]}>
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
              <LinearGradient colors={['#2f3640', '#222']} style={styles.levelDialog}>
                <Dialog.Title style={styles.containerTitle}>Modo Competitivo</Dialog.Title>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleStartCompetitiveGame}>
                    <LinearGradient
                      colors={['#72a34d', '#527a33']}
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
            onDismiss={() => setShowRecords(false)} style={styles.dialogStyle}>
            <LinearGradient colors={['#2f3640', '#222']} style={styles.levelDialog}>
              <Dialog.Title style={styles.containerTitle}>Recordes do Modo Casual</Dialog.Title>
              <Dialog.Content>
                <Text style={[styles.textRecords, { color: 'green'}]}>Fácil: {records.easy}</Text>
                <Text style={[styles.textRecords, { color: 'orange'}]}>Intermediário: {records.medium}</Text>
                <Text style={[styles.textRecords, { color: 'red'}]}>Difícil: {records.hard}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setShowRecords(false)}><Text style={styles.textBase}>OK</Text></Button>
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
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textBase: {
    fontSize: 17,
    fontWeight: 'bold',
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
  },
  iconButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  // Estilos específicos para botões
  playButton: {
    marginBottom: 15,
  },
  competitiveButton: {
    marginBottom: 40,
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
    alignItems: 'center'
  },
  levelDialog: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 400,
    width: 400,
  },
  containerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Container de botões dentro do Dialog
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 50,
  },

  // texto do menu de recordes
  textRecords: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 5, 
    marginTop: 40,
    color: 'white'
  },

  // Estilo para o BlurView
  blurView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, 
  },
});

export default React.memo(InitialScreen);
