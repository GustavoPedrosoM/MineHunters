// src/context/GameContext.js

import React, { createContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createMinedBoard,
  cloneBoard,
  openField,
  openInitialArea,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  spreadMines,
  getMineCount,
  findSafePosition,
} from '../functions';
import params from '../params';

const initialState = {
  board: [],
  won: false,
  lost: false,
  gameStarted: false,
  gameOverVisible: false,
  isWin: false,
  level: 0.1,
  bestTimes: {
    easy: null,
    medium: null,
    hard: null,
  },
  mode: 'competitivo',
  ranking: 'Fácil',
  victoriesCount: 0,
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'SET_LEVEL':
      return { ...state, level: action.level };

    case 'NEW_GAME':
      const cols = params.getColumsAmount(state.level);
      const rows = params.getRowsAmount(state.level);
      const mines = getMineCount(state.level);

      // Criar o tabuleiro vazio
      let newBoard = createMinedBoard(rows, cols, 0);

      // Encontrar uma posição segura para iniciar
      const safePosition = findSafePosition(newBoard);

      // Definir a profundidade desejada para a área inicial
      const initialAreaDepth = 2.3;

      // Determinar as posições da área inicial
      const initialPositions = [];
      if (safePosition) {
        openInitialArea(
          newBoard,
          safePosition.row,
          safePosition.column,
          initialAreaDepth,
          {},
          initialPositions
        );
      }

      // Fechar os campos abertos (iremos reabri-los depois)
      initialPositions.forEach((pos) => {
        const field = newBoard[pos.row][pos.column];
        field.opened = false;
      });

      // Espalhar as minas excluindo as posições da área inicial
      spreadMines(newBoard, mines, initialPositions);

      // Agora, abrir novamente a área inicial (com o nearMines atualizado)
      if (safePosition) {
        openInitialArea(
          newBoard,
          safePosition.row,
          safePosition.column,
          initialAreaDepth,
          {},
          []
        );
      }

      return {
        ...state,
        board: newBoard,
        won: false,
        lost: false,
        gameStarted: true,
        gameOverVisible: false,
        isWin: false,
      };

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

      if (won && state.mode === 'competitivo') {
        newVictoriesCount += 1;

        if (newRanking === 'Fácil' && newVictoriesCount >= 5) {
          newRanking = 'Intermediário';
          newLevel = 0.2;
          newVictoriesCount = 0;
        } else if (newRanking === 'Intermediário' && newVictoriesCount >= 5) {
          newRanking = 'Difícil';
          newLevel = 0.3;
          newVictoriesCount = 0;
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
      };

    case 'SELECT_FIELD':
      if (state.lost || state.won) return state;

      const newBoardSelect = cloneBoard(state.board);
      invertFlag(newBoardSelect, action.row, action.column);

      return {
        ...state,
        board: newBoardSelect,
      };

    case 'SET_BEST_TIME':
      return {
        ...state,
        bestTimes: {
          ...state.bestTimes,
          [action.level]: action.time,
        },
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        bestTimes: state.bestTimes,
        mode: state.mode,
        ranking: state.ranking,
        level: state.level,
        victoriesCount: state.victoriesCount,
      };

    case 'TOGGLE_GAME_OVER':
      return { ...state, gameOverVisible: !state.gameOverVisible };

    default:
      return state;
  }
};

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const saveBestTime = async (level, time) => {
    try {
      let levelKey = '';
      if (level === 0.1) levelKey = 'easy';
      else if (level === 0.2) levelKey = 'medium';
      else if (level === 0.3) levelKey = 'hard';

      const key = `bestTime_${levelKey}`;
      const existingTime = await AsyncStorage.getItem(key);
      if (!existingTime || time < parseFloat(existingTime)) {
        await AsyncStorage.setItem(key, time.toString());
        dispatch({ type: 'SET_BEST_TIME', level: levelKey, time });
      }
    } catch (error) {
      console.error('Erro ao salvar o melhor tempo:', error);
    }
  };

  const loadBestTime = async (level) => {
    try {
      let levelKey = '';
      if (level === 0.1) levelKey = 'easy';
      else if (level === 0.2) levelKey = 'medium';
      else if (level === 0.3) levelKey = 'hard';

      const key = `bestTime_${levelKey}`;
      const time = await AsyncStorage.getItem(key);
      return time ? parseFloat(time) : null;
    } catch (error) {
      console.error('Erro ao carregar o melhor tempo:', error);
      return null;
    }
  };

  return (
    <GameContext.Provider
      value={{ state, dispatch, saveBestTime, loadBestTime }}
    >
      {children}
    </GameContext.Provider>
  );
};
