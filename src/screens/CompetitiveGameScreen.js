import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { GameContext } from '../context/GameContext';
import { Portal, Dialog, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MineField from '../components/MineField';
import GameOverDialog from '../components/GameOverDialog';
import { flagsUsed, getMineCount, getBlockSize, getLevelByRanking } from '../functions';
import params from '../params'; 

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
            <Text style={styles.victoryText}></Text>
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
          <Dialog visible={pauseVisible} onDismiss={closePauseMenu}>
            <Dialog.Title>Pausado</Dialog.Title>
            <Dialog.Content>
              <Button mode="contained" onPress={closePauseMenu} style={styles.resumeButton}>
                Continuar Jogo
              </Button>
              <Button mode="contained" onPress={handleExit} style={styles.exitButton}>
                Voltar ao Menu Principal
              </Button>
            </Dialog.Content>
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
    paddingHorizontal: 50,
    marginLeft: 10,
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
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {},
  resumeButton: {
    marginVertical: 10,
    backgroundColor: '#3498db',
  },
  exitButton: {
    marginVertical: 10,
    backgroundColor: '#e74c3c',
  },
});

export default CompetitiveGameScreen;
