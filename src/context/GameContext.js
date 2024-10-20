// src/context/GameContext.js

import React, { createContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createMinedBoard,
  calculateNearMines,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  getMineCount,
  findSafePosition,
} from '../functions';
import params from '../params';

// Função para mapear nível numérico para chave de string
const getLevelKey = (level) => {
  switch (level) {
    case 0.1:
      return 'easy';
    case 0.2:
      return 'medium';
    case 0.3:
      return 'hard';
    default:
      return 'unknown';
  }
};

const initialState = {
  board: [],
  won: false,
  lost: false,
  gameStarted: false,
  gameOverVisible: false,
  isWin: false,
  level: 0.1,
  mode: 'competitivo', // ou 'casual'
  ranking: 'Fácil', // Ranking inicial para o modo competitivo
  victoriesCount: 0,
  countdownTime: null, // Tempo restante em segundos (usado apenas nos rankings com timer)
  bestTimes: {
    easy: null,
    medium: null,
    hard: null,
  },
  score: 0, // Pontuação do jogador no ranking "Rei do Campo Minado"
  promotionVisible: false, // Controla a exibição da tela de promoção
  previousRanking: null, // Armazena o ranking anterior para exibir na promoção
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'SET_LEVEL':
      return { ...state, level: action.level };

    case 'SET_BEST_TIME':
      return {
        ...state,
        bestTimes: {
          ...state.bestTimes,
          [action.level]: action.time,
        },
      };

    case 'NEW_GAME':
      {
        const cols = params.getColumsAmount(state.level);
        const rows = params.getRowsAmount(state.level);
        const mines = getMineCount(state.level);

        // Criar o tabuleiro e espalhar as minas
        let newBoard = createMinedBoard(rows, cols, mines);

        // Calcular nearMines para todos os campos
        calculateNearMines(newBoard);

        // Tentar encontrar uma posição segura aleatória
        let safePosition = findSafePosition(newBoard);
        let attempts = 0;
        while (
          (newBoard[safePosition.row][safePosition.column].mined ||
            newBoard[safePosition.row][safePosition.column].nearMines !== 0) &&
          attempts < 1000
        ) {
          safePosition = findSafePosition(newBoard);
          attempts++;
        }

        // Se não encontrar uma posição segura, escolher a primeira posição não minada com nearMines === 0
        if (
          newBoard[safePosition.row][safePosition.column].mined ||
          newBoard[safePosition.row][safePosition.column].nearMines !== 0
        ) {
          outerLoop: for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (
                !newBoard[r][c].mined &&
                newBoard[r][c].nearMines === 0
              ) {
                safePosition = { row: r, column: c };
                break outerLoop;
              }
            }
          }
        }

        // Definir a profundidade inicial
        const initialDepth = 1; // Ajuste este valor conforme necessário

        // Abrir o campo inicial com profundidade limitada
        openField(newBoard, safePosition.row, safePosition.column, initialDepth);

        // Definir o tempo de contagem regressiva com base no ranking
        let countdownTime = null;
        if (state.mode === 'competitivo') {
          if (state.ranking === 'Especialista') {
            countdownTime = 210; // 3 minutos e 30 segundos
          } else if (state.ranking === 'Rei do Campo Minado') {
            countdownTime = 180; // 3 minutos
          }
        }

        return {
          ...state,
          board: newBoard,
          won: false,
          lost: false,
          gameStarted: true,
          gameOverVisible: false,
          isWin: false,
          countdownTime: countdownTime,
        };
      }

    case 'OPEN_FIELD':
      if (state.lost || state.won) return state;

      const newBoardOpen = cloneBoard(state.board);
      openField(newBoardOpen, action.row, action.column);

      const lost = hadExplosion(newBoardOpen);
      const won = wonGame(newBoardOpen);

      if (lost) {
        showMines(newBoardOpen);
      }

      let newVictoriesCount = state.victoriesCount;
      let newRanking = state.ranking;
      let newLevel = state.level;
      let newCountdownTime = state.countdownTime;
      let newScore = state.score;
      let promotionOccurred = false;
      let previousRanking = state.previousRanking;

      if (won && state.mode === 'competitivo') {
        if (newRanking === 'Rei do Campo Minado') {
          // Sistema de pontuação no ranking "Rei do Campo Minado"
          newScore += 3;
        } else {
          newVictoriesCount += 1;

          if (newRanking === 'Fácil' && newVictoriesCount >= 1) {
            promotionOccurred = true;
            previousRanking = 'Fácil';
            newRanking = 'Intermediário';
            newLevel = 0.2;
            newVictoriesCount = 0;
            newCountdownTime = null;
          } else if (newRanking === 'Intermediário' && newVictoriesCount >= 1) {
            promotionOccurred = true;
            previousRanking = 'Intermediário';
            newRanking = 'Especialista';
            newLevel = 0.3;
            newVictoriesCount = 0;
            newCountdownTime = 210; // 3 minutos e 30 segundos
          } else if (newRanking === 'Especialista' && newVictoriesCount >= 1) {
            promotionOccurred = true;
            previousRanking = 'Especialista';
            newRanking = 'Rei do Campo Minado';
            newLevel = 0.3;
            newVictoriesCount = 0;
            newCountdownTime = 180; // 3 minutos
            newScore = 0; // Iniciar pontuação
          }
        }
      }

      if (lost && state.mode === 'competitivo') {
        if (newRanking === 'Especialista') {
          // Resetar o timer no ranking "Especialista"
          newCountdownTime = 210;
        } else if (newRanking === 'Rei do Campo Minado') {
          // Subtrair 1 ponto no ranking "Rei do Campo Minado", mínimo zero
          newScore = Math.max(0, newScore - 1);
        }
      }

      return {
        ...state,
        board: newBoardOpen,
        lost,
        won,
        gameStarted: true,
        gameOverVisible: lost || won,
        isWin: won,
        victoriesCount: newVictoriesCount,
        ranking: newRanking,
        level: newLevel,
        countdownTime: newCountdownTime,
        score: newScore,
        promotionVisible: promotionOccurred || state.promotionVisible,
        previousRanking: promotionOccurred ? previousRanking : state.previousRanking,
      };

    case 'SELECT_FIELD':
      if (state.lost || state.won) return state;

      const newBoardSelect = cloneBoard(state.board);
      invertFlag(newBoardSelect, action.row, action.column);

      return {
        ...state,
        board: newBoardSelect,
      };

    case 'GAME_OVER_TIME_UP':
      let updatedScore = state.score;
      if (state.ranking === 'Rei do Campo Minado') {
        // Subtrair 1 ponto no ranking "Rei do Campo Minado", mínimo zero
        updatedScore = Math.max(0, updatedScore - 1);
      }

      return {
        ...state,
        lost: true,
        gameOverVisible: true,
        isWin: false,
        countdownTime:
          state.ranking === 'Especialista' ? 210 :
          state.ranking === 'Rei do Campo Minado' ? 180 : null,
        score: updatedScore,
      };

    case 'TOGGLE_GAME_OVER':
      return { ...state, gameOverVisible: !state.gameOverVisible };

    case 'HIDE_PROMOTION':
      return {
        ...state,
        promotionVisible: false,
        previousRanking: null,
      };

    default:
      return state;
  }
};

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Função para salvar o melhor tempo
  const saveBestTime = async (level, time) => {
    try {
      if (time <= 0) {
        console.warn('Tempo inválido, não será salvo:', time);
        return;
      }

      const levelKey = getLevelKey(level);
      const key = `bestTime_${levelKey}`;
      const existingTime = await AsyncStorage.getItem(key);

      if (!existingTime || time < parseFloat(existingTime)) {
        await AsyncStorage.setItem(key, time.toString());
        dispatch({ type: 'SET_BEST_TIME', level: levelKey, time });
        console.log('Best time updated:', levelKey, time);
      } else {
        console.log('Best time not updated:', levelKey, time, 'Existing time:', existingTime);
      }
    } catch (error) {
      console.error('Erro ao salvar o melhor tempo:', error);
    }
  };

  // Função para carregar o melhor tempo
  const loadBestTime = async (level) => {
    try {
      const levelKey = getLevelKey(level);
      const key = `bestTime_${levelKey}`;
      const time = await AsyncStorage.getItem(key);
      const formattedTime = time ? parseFloat(time) : null;
      dispatch({ type: 'SET_BEST_TIME', level: levelKey, time: formattedTime });
      return formattedTime;
    } catch (error) {
      console.error('Erro ao carregar o melhor tempo:', error);
      return null;
    }
  };

  return (
    <GameContext.Provider value={{ state, dispatch, saveBestTime, loadBestTime }}>
      {children}
    </GameContext.Provider>
  );
};
