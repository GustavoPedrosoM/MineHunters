// src/components/GameScreen.js
import React, { useContext, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from './Header';
import MineField from './MineField';
import GameOverDialog from './GameOverDialog';
import params from '../params';
import { flagsUsed } from '../functions';

const GameScreen = ({ navigation, route }) => {
  const { state, dispatch } = useContext(GameContext);
  const timerRef = useRef();

  const minesAmount = (level) => {
    const cols = params.getColumsAmount(level);
    const rows = params.getRowsAmount(level);
    return Math.ceil(cols * rows * level);
  };

  useEffect(() => {
    dispatch({ type: 'SET_LEVEL', level: route.params.difficultLevel });
    dispatch({ type: 'NEW_GAME' });
  }, [route.params.difficultLevel]);

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
    timerRef.current.reset();
  };

  const handleCancel = () => {
    dispatch({ type: 'TOGGLE_GAME_OVER' });
  };

  const handleOpenField = (row, column) => {
    if (!state.gameStarted) {
      timerRef.current.start();
    }
    dispatch({ type: 'OPEN_FIELD', row, column });
  };

  const handleSelectField = (row, column) => {
    dispatch({ type: 'SELECT_FIELD', row, column });
  };

  const flagsLeft = useMemo(() => minesAmount(state.level) - flagsUsed(state.board), [state.level, state.board]);
  const blockSize = useMemo(() => params.getBlockSize(params.getRowsAmount(state.level), params.getColumsAmount(state.level)), [state.level]);

  return (
    <ImageBackground source={require('../assets/images/op2.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header
            flagsLeft={flagsLeft}
            onNewGame={handleNewGame}
            onExit={() => navigation.navigate('Home')}
            timerRef={timerRef}
          />
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
    flex: 1,
    justifyContent: 'flex-start',
  },
  boardContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameScreen;
