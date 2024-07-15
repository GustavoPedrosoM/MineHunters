import React, { createContext, useReducer } from 'react';
import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
} from '../functions';
import params from '../params';

const initialState = {
  board: [],
  won: false,
  lost: false,
  gameStarted: false,
  gameOverVisible: false,
  isWin: false,
  level: 0.1, // Default level
};

const minesAmount = (level) => {
  const cols = params.getColumsAmount(level);
  const rows = params.getRowsAmount(level);
  return Math.ceil(cols * rows * level); // Usar Math.ceil para arredondar para cima
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LEVEL':
      return { ...state, level: action.level };
    case 'NEW_GAME':
      const cols = params.getColumsAmount(state.level);
      const rows = params.getRowsAmount(state.level);
      return {
        ...initialState,
        level: state.level,
        board: createMinedBoard(rows, cols, minesAmount(state.level)),
      };
    case 'OPEN_FIELD':
      const newBoard = cloneBoard(state.board);
      openField(newBoard, action.row, action.column);
      const lost = hadExplosion(newBoard);
      const won = wonGame(newBoard);
      if (lost) {
        showMines(newBoard);
      }
      return {
        ...state,
        board: newBoard,
        lost,
        won,
        gameStarted: true,
        gameOverVisible: lost || won,
        isWin: won,
      };
    case 'SELECT_FIELD':
      const newBoardSelect = cloneBoard(state.board);
      invertFlag(newBoardSelect, action.row, action.column);
      const wonSelect = wonGame(newBoardSelect);
      return {
        ...state,
        board: newBoardSelect,
        won: wonSelect,
        gameOverVisible: wonSelect,
        isWin: wonSelect,
      };
    case 'RESET_GAME':
      return initialState;
    case 'TOGGLE_GAME_OVER':
      return { ...state, gameOverVisible: !state.gameOverVisible };
    default:
      return state;
  }
};

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
