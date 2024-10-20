// src/screens/CasualGameScreen.js

import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import MineField from '../components/MineField';
import GameOverDialog from '../components/GameOverDialog';
import { flagsUsed, getMineCount, getBlockSize } from '../functions';
import params from '../params';

const CasualGameScreen = ({ navigation, route }) => {
  const { state, dispatch, saveBestTime, loadBestTime } = useContext(GameContext);
  const timerRef = useRef();
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    try {
      dispatch({ type: 'SET_MODE', mode: 'casual' });
      dispatch({ type: 'SET_LEVEL', level: route.params.difficultLevel });
      dispatch({ type: 'NEW_GAME' });

      setGameStarted(true); // Indica que um novo jogo foi iniciado

      loadBestTime(route.params.difficultLevel);
    } catch (e) {
      console.error('Erro ao iniciar o jogo:', e);
    }
  }, [route.params.difficultLevel]);

  // Inicia o timer quando timerRef.current está disponível e um novo jogo foi iniciado
  useEffect(() => {
    if (timerRef.current && gameStarted) {
      timerRef.current.reset();
      timerRef.current.start();
      setGameStarted(false); // Reseta o estado para evitar reiniciar o timer inadvertidamente
    }
  }, [timerRef.current, gameStarted]);

  const handleNewGame = () => {
    try {
      dispatch({ type: 'NEW_GAME' });

      setGameStarted(true); // Indica que um novo jogo foi iniciado

      loadBestTime(state.level);
    } catch (e) {
      console.error('Erro ao iniciar um novo jogo:', e);
    }
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
