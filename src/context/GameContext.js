import React, { createContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  spreadMines,
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
  firstMove: true,
};

const minesAmount = (level) => {
  const cols = params.getColumsAmount(level);
  const rows = params.getRowsAmount(level);
  return Math.ceil(cols * rows * level);
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
      return {
        ...state,
        board: createMinedBoard(rows, cols, 0),
        won: false,
        lost: false,
        gameStarted: false,
        gameOverVisible: false,
        isWin: false,
        firstMove: true,
      };

    case 'OPEN_FIELD':
      if (state.lost || state.won) return state;

      const newBoard = cloneBoard(state.board);

      if (state.firstMove) {
        const cols = params.getColumsAmount(state.level);
        const rows = params.getRowsAmount(state.level);
        const mines = minesAmount(state.level);

        spreadMines(newBoard, mines, action.row, action.column);
        openField(newBoard, action.row, action.column);

        const lost = hadExplosion(newBoard);
        const won = wonGame(newBoard);

        if (lost) {
          showMines(newBoard);
        }

        return {
          ...state,
          board: newBoard,
          firstMove: false,
          gameStarted: true,
          lost,
          won,
          gameOverVisible: lost || won,
          isWin: won,
        };
      }

      openField(newBoard, action.row, action.column);
      const lost = hadExplosion(newBoard);
      const won = wonGame(newBoard);

      if (lost) {
        showMines(newBoard);
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
        }
      }

      return {
        ...state,
        board: newBoard,
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
    <GameContext.Provider value={{ state, dispatch, saveBestTime, loadBestTime }}>
      {children}
    </GameContext.Provider>
  );
};
