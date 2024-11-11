import { Dimensions } from 'react-native';

// Configuração de parâmetros do tabuleiro
const boardSize = Dimensions.get('window').width - 30;

const levelDimensions = {
  0.1: { columns: 6, rows: 6 },
  0.2: { columns: 8, rows: 8 },
  0.3: { columns: 10, rows: 10 },
};

// Funções utilitárias para tamanhos de blocos e nível
const getBlockSize = (level) => {
  const { columns, rows } = levelDimensions[level] || { columns: 6, rows: 6 };
  return boardSize / Math.max(rows, columns);
};

const getColumsAmount = (level) => levelDimensions[level]?.columns || 6;
const getRowsAmount = (level) => levelDimensions[level]?.rows || 6;

const getLevelKey = (level) => {
  if (level === 0.1) return 'easy';
  else if (level === 0.2) return 'medium';
  else if (level === 0.3) return 'hard';
  return 'unknown';
};

const getMineCount = (level) => {
  if (level === 0.1) return 5;
  if (level === 0.2) return 12;
  if (level === 0.3) return 20;
  return Math.ceil(getColumsAmount(level) * getRowsAmount(level) * level);
};

// Funções de criação e configuração do tabuleiro
const createBoard = (rows, columns) =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, column) => ({
      row,
      column,
      opened: false,
      flagged: false,
      mined: false,
      exploded: false,
      nearMines: 0,
    }))
  );

const spreadMines = (board, minesAmount, excludedPositions = []) => {
  const flatBoard = board.flat();
  const excludeKeys = new Set(excludedPositions.map(pos => `${pos.row},${pos.column}`));
  let minesPlanted = 0;

  while (minesPlanted < minesAmount) {
    const randomIndex = Math.floor(Math.random() * flatBoard.length);
    const cell = flatBoard[randomIndex];
    const key = `${cell.row},${cell.column}`;

    if (!cell.mined && !excludeKeys.has(key)) {
      cell.mined = true;
      minesPlanted++;
    }
  }
};

const createMinedBoard = (rows, columns, minesAmount) => {
  const board = createBoard(rows, columns);
  spreadMines(board, minesAmount);
  return board;
};

const calculateNearMines = (board) => {
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      const field = board[row][column];
      field.nearMines = getNeighbors(board, row, column).filter(n => n.mined).length;
    }
  }
};

// Funções de manipulação de estado do tabuleiro
const cloneBoard = (board) => board.map(rows => rows.map(field => ({ ...field })));

const openField = (board, row, column, depth = Infinity) => {
  const field = board[row][column];
  if (!field.opened && !field.flagged) {
    field.opened = true;

    if (field.mined) {
      field.exploded = true;
    } else if (field.nearMines === 0 && depth > 0) {
      getNeighbors(board, row, column).forEach(n => openField(board, n.row, n.column, depth - 1));
    }
  }
};

const getNeighbors = (board, row, column) => {
  const neighbors = [];
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = column - 1; c <= column + 1; c++) {
      if (
        r >= 0 &&
        r < board.length &&
        c >= 0 &&
        c < board[0].length &&
        (r !== row || c !== column)
      ) {
        neighbors.push(board[r][c]);
      }
    }
  }
  return neighbors;
};

const fields = (board) => board.flat();
const hadExplosion = (board) => fields(board).some(field => field.exploded);
const pending = (field) => (field.mined && !field.flagged) || (!field.mined && !field.opened);
const wonGame = (board) => fields(board).every(field => !pending(field));
const showMines = (board) => fields(board).filter(field => field.mined).forEach(field => (field.opened = true));
const invertFlag = (board, row, column) => {
  const field = board[row][column];
  if (!field.opened) {
    field.flagged = !field.flagged;
  }
};

const flagsUsed = (board) => fields(board).filter(field => field.flagged).length;

const findSafePosition = (board) => {
  const rows = board.length;
  const columns = board[0].length;
  const row = Math.floor(Math.random() * rows);
  const column = Math.floor(Math.random() * columns);
  return { row, column };
};

// Exportação das Funções
export {
  boardSize,
  getBlockSize,
  getColumsAmount,
  getRowsAmount,
  getLevelKey,
  getMineCount,
  createMinedBoard,
  calculateNearMines,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
  spreadMines,
  findSafePosition,
};
