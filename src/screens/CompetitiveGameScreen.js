// src/screens/CompetitiveGameScreen.js

import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { GameContext } from '../context/GameContext';
import CompetitiveHeader from '../components/CompetitiveHeader';
import MineField from '../components/MineField';
import GameOverDialog from '../components/gameOverDialog';
import RankingPromotionDialog from '../components/RankingPromotionDialog'; // Importar o novo componente
import { flagsUsed, getMineCount, getBlockSize } from '../functions';
import params from '../params';

const CompetitiveGameScreen = ({ navigation }) => {
  const { state, dispatch } = useContext(GameContext);
  const timerRef = useRef();
  const [gameStarted, setGameStarted] = useState(false);

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

  // Inicia o timer apenas se o ranking for 'Especialista' ou 'Rei do Campo Minado'
  useEffect(() => {
    if (timerRef.current && gameStarted) {
      if (state.ranking === 'Especialista' || state.ranking === 'Rei do Campo Minado') {
        timerRef.current.reset();
        timerRef.current.start();
        console.log(`Timer iniciado no ranking ${state.ranking}`);
      }
      setGameStarted(false);
    }
  }, [timerRef.current, gameStarted]);

  // Parar o timer se o ranking não for 'Especialista' ou 'Rei do Campo Minado'
  useEffect(() => {
    if (
      state.ranking !== 'Especialista' &&
      state.ranking !== 'Rei do Campo Minado' &&
      timerRef.current
    ) {
      timerRef.current.stop();
      timerRef.current.reset();
      console.log('Timer parado e resetado pois o ranking não é Especialista nem Rei do Campo Minado');
    }
  }, [state.ranking]);

  const handleNewGame = () => {
    try {
      dispatch({ type: 'NEW_GAME' });

      setGameStarted(true); // Indica que um novo jogo foi iniciado
    } catch (e) {
      console.error('Erro ao iniciar um novo jogo:', e);
    }
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
      (state.ranking === 'Especialista' || state.ranking === 'Rei do Campo Minado') &&
      state.mode === 'competitivo'
    ) {
      dispatch({ type: 'GAME_OVER_TIME_UP' });
    }
  };

  // Funções para o diálogo de promoção
  const handleContinue = () => {
    dispatch({ type: 'HIDE_PROMOTION' });
    handleNewGame();
  };

  const handleGoHome = () => {
    dispatch({ type: 'HIDE_PROMOTION' });
    navigation.navigate('Home');
  };

  const totalMines = getMineCount(state.level);
  const flagsLeft = totalMines - flagsUsed(state.board);
  const blockSize = getBlockSize(state.level);

  // Definir o tempo de contagem regressiva com base no ranking
  const countdownTime =
    state.ranking === 'Especialista' ? 210 :
    state.ranking === 'Rei do Campo Minado' ? 180 : null;

  // Determinar o número de vitórias necessárias para a promoção anterior
  const victoriesNeeded =
    state.previousRanking === 'Fácil' ? 1 :
    state.previousRanking === 'Intermediário' ? 1 :
    state.previousRanking === 'Especialista' ? 1 : 0;

  return (
    <ImageBackground
      source={require('../assets/images/teladejogo4.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <CompetitiveHeader
            flagsLeft={flagsLeft}
            onNewGame={handleNewGame}
            onExit={() => navigation.navigate('Home')}
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
