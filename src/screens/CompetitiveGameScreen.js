// src/screens/CompetitiveGameScreen.js

import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, ImageBackground, AppState } from 'react-native';
import Sound from 'react-native-sound';

import { GameContext } from '../context/GameContext';
import CompetitiveHeader from '../components/CompetitiveHeader';
import MineField from '../components/MineField';
import GameOverDialog from '../components/GameOverDialog';
import RankingPromotionDialog from '../components/RankingPromotionDialog';
import { flagsUsed, getMineCount, getBlockSize, boardSize } from '../functions';
import MusicPlayer from '../MusicPlayer';

const CompetitiveGameScreen = ({ navigation }) => {
  const { state, dispatch } = useContext(GameContext);
  const timerRef = useRef();
  const appState = useRef(AppState.currentState);
  const [gameStarted, setGameStarted] = useState(false);
  const buttonPressSoundRef = useRef(null);

  useEffect(() => {
    Sound.setCategory('Playback');
    buttonPressSoundRef.current = new Sound(
      require('../assets/sounds/button-press.mp3'),
      (error) => {
        if (error) console.log('Erro ao carregar o som', error);
      }
    );
    return () => buttonPressSoundRef.current?.release();
  }, []);

  const playButtonSound = useCallback(() => {
    buttonPressSoundRef.current?.stop(() => {
      buttonPressSoundRef.current?.play((success) => {
        if (!success) console.log('Erro ao tocar o som');
      });
    });
  }, []);

  useEffect(() => {
    try {
      dispatch({ type: 'SET_MODE', mode: 'competitivo' });
      dispatch({ type: 'SET_LEVEL', level: state.level });
      dispatch({ type: 'NEW_GAME' });
      setGameStarted(true);
    } catch (e) {
      console.error('Erro ao iniciar o jogo:', e);
    }
  }, [dispatch, state.level]);

  useEffect(() => {
    if (timerRef.current && gameStarted && !state.promotionVisible) {
      if (
        state.ranking === 'Especialista' ||
        state.ranking === 'Rei do Campo Minado'
      ) {
        timerRef.current.reset();
        timerRef.current.start();
      }
      setGameStarted(false);
    }
  }, [timerRef, gameStarted, state.promotionVisible, state.ranking]);

  useEffect(() => {
    if (
      state.ranking !== 'Especialista' &&
      state.ranking !== 'Rei do Campo Minado' &&
      timerRef.current
    ) {
      timerRef.current.stop();
      timerRef.current.reset();
    }
  }, [state.ranking]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        if (
          state.ranking === 'Rei do Campo Minado' &&
          !state.won &&
          !state.lost
        ) {
          dispatch({ type: 'LOSE_POINT_FOR_EXIT' });
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => subscription.remove();
  }, [state.ranking, state.won, state.lost, dispatch]);

  const handleNewGame = useCallback(() => {
    playButtonSound();
    dispatch({ type: 'NEW_GAME' });
    setGameStarted(true);
    if (!state.isMusicMuted) MusicPlayer.play();

    timerRef.current?.reset();
    timerRef.current?.start();
  }, [dispatch, playButtonSound, state.isMusicMuted]);

  const handleExit = useCallback(() => {
    playButtonSound();
    if (state.ranking === 'Rei do Campo Minado' && !state.won && !state.lost) {
      dispatch({ type: 'LOSE_POINT_FOR_EXIT' });
    }
    if (!state.isMusicMuted) MusicPlayer.play();
    navigation.navigate('Home');
  }, [playButtonSound, navigation, state.ranking, state.won, state.lost, state.isMusicMuted, dispatch]);

  useEffect(() => {
    if (state.won || state.lost) {
      timerRef.current?.stop();
      if (!state.isMusicMuted) MusicPlayer.play();
    }
  }, [state.won, state.lost, state.isMusicMuted]);

  const handleCountdownFinish = useCallback(() => {
    if (
      (state.ranking === 'Especialista' ||
        state.ranking === 'Rei do Campo Minado') &&
      state.mode === 'competitivo'
    ) {
      dispatch({ type: 'GAME_OVER_TIME_UP' });
    }
  }, [dispatch, state.ranking, state.mode]);

  const handleContinue = useCallback(() => {
    playButtonSound();
    dispatch({ type: 'HIDE_PROMOTION' });
    handleNewGame();
    if (
      timerRef.current &&
      (state.ranking === 'Especialista' || state.ranking === 'Rei do Campo Minado')
    ) {
      timerRef.current.reset();
      timerRef.current.start();
    }
  }, [dispatch, handleNewGame, playButtonSound, state.ranking]);

  const handleGoHome = useCallback(() => {
    playButtonSound();
    dispatch({ type: 'HIDE_PROMOTION' });
    navigation.navigate('Home');
  }, [playButtonSound, dispatch, navigation]);

  const totalMines = getMineCount(state.level);
  const flagsLeft = totalMines - flagsUsed(state.board);
  const blockSize = getBlockSize(state.level);

  const countdownTime =
    state.ranking === 'Especialista'
      ? 210
      : state.ranking === 'Rei do Campo Minado'
      ? 180
      : null;

  const victoriesNeeded =
    state.previousRanking === 'Iniciante'
      ? 1
      : state.previousRanking === 'Amador'
      ? 1
      : state.previousRanking === 'Especialista'
      ? 1
      : 0;

  return (
    <ImageBackground
      source={require('../assets/images/teladejogo.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <CompetitiveHeader
            flagsLeft={flagsLeft}
            onExit={handleExit}
            timerRef={timerRef}
            countdown={countdownTime}
            onCountdownFinish={handleCountdownFinish}
            ranking={state.ranking}
            victoriesCount={state.victoriesCount}
            score={state.score}
          />
        </View>
        <View style={styles.boardContainer}>
          <View
            style={[
              styles.board,
              { width: boardSize, height: boardSize },
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
        <RankingPromotionDialog
          visible={state.promotionVisible}
          onContinue={handleContinue}
          onGoHome={handleGoHome}
          previousRanking={state.previousRanking}
          newRanking={state.ranking}
          victoriesNeeded={victoriesNeeded}
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

export default CompetitiveGameScreen;
