// src/screens/CasualGameScreen.js

import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import MineField from '../components/MineField';
import GameOverDialog from '../components/gameOverDialog';
import { flagsUsed, getMineCount, getBlockSize } from '../functions';
import params from '../params';

const CasualGameScreen = ({ navigation, route }) => {
  const { state, dispatch, saveBestTime, loadBestTime } = useContext(GameContext);
  const timerRef = useRef();
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      dispatch({ type: 'SET_MODE', mode: 'casual' });
      dispatch({ type: 'SET_LEVEL', level: route.params.difficultLevel });
      dispatch({ type: 'NEW_GAME' });

      // Iniciar o timer imediatamente após o jogo começar
      timerRef.current.reset();
      timerRef.current.start();

      loadBestTime(route.params.difficultLevel).then((time) => {
        dispatch({ type: 'SET_BEST_TIME', level: route.params.difficultLevel, time });
      });
    } catch (e) {
      setError(e.message);
    }
  }, [route.params.difficultLevel]);

  const handleNewGame = () => {
    try {
      dispatch({ type: 'NEW_GAME' });
      timerRef.current.reset();
      timerRef.current.start(); // Iniciar o timer ao iniciar um novo jogo

      loadBestTime(state.level).then((time) => {
        dispatch({ type: 'SET_BEST_TIME', level: state.level, time });
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCancel = () => {
    dispatch({ type: 'TOGGLE_GAME_OVER' });
  };

  const handleOpenField = (row, column) => {
    try {
      // Remover a inicialização do timer daqui
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

  useEffect(() => {
    if (state.won || state.lost) {
      const currentTime = timerRef.current.getTime();
      timerRef.current.stop();
      if (state.won) {
        saveBestTime(state.level, currentTime).then(() => {
          loadBestTime(state.level).then((time) => {
            dispatch({ type: 'SET_BEST_TIME', level: state.level, time });
          });
        });
      }
    }
  }, [state.won, state.lost]);

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
            onExit={() => navigation.navigate('Home')}
            timerRef={timerRef}
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

export default CasualGameScreen;
