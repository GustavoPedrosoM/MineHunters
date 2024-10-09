import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { GameContext } from '../context/GameContext';
import { Portal, Dialog, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MineField from '../components/MineField';
import GameOverDialog from '../components/gameOverDialog';
import { flagsUsed, getMineCount, getBlockSize, getLevelByRanking } from '../functions';
import params from '../params'; 
import LinearGradient from 'react-native-linear-gradient';

const CompetitiveGameScreen = ({ navigation }) => {
  const { state, dispatch } = useContext(GameContext);
  const [error, setError] = useState(null);
  const [pauseVisible, setPauseVisible] = useState(false);

  useEffect(() => {
    try {
      dispatch({ type: 'SET_MODE', mode: 'competitivo' });
      const level = getLevelByRanking(state.ranking);
      dispatch({ type: 'SET_LEVEL', level });
      dispatch({ type: 'NEW_GAME' });
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const handleNewGame = () => {
    if (state.lost || state.won || !state.gameStarted) {
      dispatch({ type: 'NEW_GAME' });
    }
  };

  const handleCancel = () => {
    dispatch({ type: 'TOGGLE_GAME_OVER' });
  };

  const handleOpenField = (row, column) => {
    try {
      dispatch({ type: 'OPEN_FIELD', row, column });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSelectField = (row, column) => {
    try {
      dispatch({ type: 'SELECT_FIELD', row, column });
    } catch (e) {
      setError(e.message);
    }
  };

  const totalMines = getMineCount(state.level);
  const flagsLeft = totalMines - flagsUsed(state.board);
  const blockSize = getBlockSize(state.level);

  const handlePause = () => {
    setPauseVisible(true);
  };

  const closePauseMenu = () => {
    setPauseVisible(false);
  };

  const handleExit = () => {
    setPauseVisible(false);
    navigation.navigate('Home');
  };

  return (
    <ImageBackground source={require('../assets/images/teladejogo.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.flagsContainer}>
              <Icon name="flag" size={30} color="white" />
              <Text style={styles.flagsText}>= {flagsLeft}</Text>
            </View>
            <Text style={styles.levelText}>{state.ranking} - {state.victoriesCount}v</Text>
            <TouchableOpacity onPress={handlePause} style={styles.iconButton}>
              <Icon name="pause-circle" size={45} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.boardContainer}>
          <View style={[styles.board, { width: params.boardSize, height: params.boardSize }]}>
            <MineField
              board={state.board}
              onOpenField={handleOpenField}
              onSelectField={handleSelectField}
              blockSize={blockSize}
            />
          </View>
        </View>
        <GameOverDialog
          isVisible={state.gameOverVisible}
          onCancel={handleCancel}
          onNewGame={handleNewGame}
          onExit={() => navigation.navigate('Home')}
          isWin={state.isWin}
        />

        {/* Menu de pausa */}
        <Portal>
        <Dialog visible={pauseVisible} onDismiss={closePauseMenu} style={styles.dialogContainer}>
            <LinearGradient colors={['#2f3640', '#222']} style={styles.menu}>
              <Dialog.Title style={styles.containerTitle}>Pausado</Dialog.Title>
              <Dialog.Content>
                <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={closePauseMenu}>
                    <LinearGradient
                      colors={['#72a34d', '#527a33']}
                      style={styles.button}>
                      <Text style={styles.textButtonMenu}>Continuar Jogo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleExit}>
                    <LinearGradient
                      colors={['#e55039', '#b33939']}
                      style={styles.button}>
                      <Text style={styles.textButtonMenu}>Menu principal</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Dialog.Content>
              </LinearGradient>
            </Dialog>
        </Portal>
      </View>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#557310',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  levelText: {
    fontSize: 22,
    fontWeight: '900',
    color: 'white',
    
  },
  flagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagsText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 5,
    fontWeight: '900',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    borderRadius: 20,
    height: 350,
    width: 350,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  dialogContainer: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    alignItems: 'center',
  },
  textButtonMenu: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  containerTitle: {
    fontWeight: 'bold',
    color: 'white',
  }
});

export default CompetitiveGameScreen;
