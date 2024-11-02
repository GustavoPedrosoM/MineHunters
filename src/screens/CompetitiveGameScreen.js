// src/screens/CompetitiveGameScreen.js

import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, AppState } from 'react-native';
import Sound from 'react-native-sound';

import { GameContext } from '../context/GameContext';
import CompetitiveHeader from '../components/CompetitiveHeader';
import MineField from '../components/MineField';
import GameOverDialog from '../components/gameOverDialog';
import RankingPromotionDialog from '../components/RankingPromotionDialog';
import { flagsUsed, getMineCount, getBlockSize } from '../functions';
import params from '../params';
import MusicPlayer from '../MusicPlayer'; // Importar o MusicPlayer

const CompetitiveGameScreen = ({ navigation }) => {
  const { state, dispatch } = useContext(GameContext);
  const timerRef = useRef();
  const appState = useRef(AppState.currentState);
  const [gameStarted, setGameStarted] = useState(false);

  // Referência para o som do botão
  const buttonPressSoundRef = useRef(null);

  useEffect(() => {
    // Inicializar o som quando o componente for montado
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

  useEffect(() => {
    try {
      dispatch({ type: 'SET_MODE', mode: 'competitivo' });
      dispatch({ type: 'SET_LEVEL', level: state.level });
      dispatch({ type: 'NEW_GAME' });

      setGameStarted(true); // Indica que um novo jogo foi iniciado
    } catch (e) {
      console.error('Erro ao iniciar o jogo:', e);
    }
  }, [state.ranking]);

  // Inicia o timer apenas se o ranking for 'Especialista' ou 'Rei do Campo Minado' e a tela de promoção não estiver visível
  useEffect(() => {
    if (timerRef.current && gameStarted && !state.promotionVisible) {
      if (
        state.ranking === 'Especialista' ||
        state.ranking === 'Rei do Campo Minado'
      ) {
        timerRef.current.reset();
        timerRef.current.start();
        console.log(`Timer iniciado no ranking ${state.ranking}`);
      }
      setGameStarted(false);
    }
  }, [timerRef.current, gameStarted, state.promotionVisible]);

  // Parar o timer se o ranking não for 'Especialista' ou 'Rei do Campo Minado'
  useEffect(() => {
    if (
      state.ranking !== 'Especialista' &&
      state.ranking !== 'Rei do Campo Minado' &&
      timerRef.current
    ) {
      timerRef.current.stop();
      timerRef.current.reset();
      console.log(
        'Timer parado e resetado pois o ranking não é Especialista nem Rei do Campo Minado'
      );
    }
  }, [state.ranking]);

  // Detectar quando o aplicativo é fechado ou vai para o background
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        // O aplicativo está sendo fechado ou minimizado
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

    return () => {
      subscription.remove();
    };
  }, [state.ranking, state.won, state.lost]);

  const handleNewGame = () => {
    playButtonSound(); // Tocar som ao iniciar novo jogo
    try {
      dispatch({ type: 'NEW_GAME' });
      setGameStarted(true); // Indica que um novo jogo foi iniciado
    } catch (e) {
      console.error('Erro ao iniciar um novo jogo:', e);
    }
  };

  const handleExit = () => {
    playButtonSound();
    // Verificar se o jogador está no ranking "Rei do Campo Minado" e se o jogo não terminou
    if (state.ranking === 'Rei do Campo Minado' && !state.won && !state.lost) {
      dispatch({ type: 'LOSE_POINT_FOR_EXIT' });
    }
    navigation.navigate('Home');
  };

  useEffect(() => {
    if (state.won || state.lost) {
      if (timerRef.current) {
        timerRef.current.stop();
      }
    }
  }, [state.won, state.lost]);

  // Função para lidar com o fim do tempo
  const handleCountdownFinish = () => {
    if (
      (state.ranking === 'Especialista' ||
        state.ranking === 'Rei do Campo Minado') &&
      state.mode === 'competitivo'
    ) {
      dispatch({ type: 'GAME_OVER_TIME_UP' });
    }
  };

  // Funções para o diálogo de promoção
  const handleContinue = () => {
    playButtonSound(); // Tocar som ao continuar
    dispatch({ type: 'HIDE_PROMOTION' });
    handleNewGame();
    // Iniciar o timer após o diálogo de promoção ser fechado
    if (
      timerRef.current &&
      (state.ranking === 'Especialista' || state.ranking === 'Rei do Campo Minado')
    ) {
      timerRef.current.reset();
      timerRef.current.start();
    }
  };

  const handleGoHome = () => {
    playButtonSound(); // Tocar som ao voltar para o menu principal
    dispatch({ type: 'HIDE_PROMOTION' });
    navigation.navigate('Home');
  };

  const totalMines = getMineCount(state.level);
  const flagsLeft = totalMines - flagsUsed(state.board);
  const blockSize = getBlockSize(state.level);

  // Definir o tempo de contagem regressiva com base no ranking
  const countdownTime =
    state.ranking === 'Especialista'
      ? 210
      : state.ranking === 'Rei do Campo Minado'
      ? 180
      : null;

  // Determinar o número de vitórias necessárias para a promoção anterior
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
      source={require('../assets/images/teladejogo4.png')}
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
            score={state.score} // Passar a pontuação atual
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
        {/* Exibir o diálogo de promoção de ranking */}
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
