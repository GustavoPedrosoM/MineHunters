// src/functions.js

import params from './params';

const createBoard = (rows, columns) => {
  return Array.from({ length: rows }, (_, row) =>
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
};

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
      field.nearMines = getNeighbors(board, row, column).filter((n) => n.mined)
        .length;
    }
  }
};

const cloneBoard = (board) =>
  board.map((rows) => rows.map((field) => ({ ...field })));

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

const openField = (board, row, column, depth = Infinity) => {
  const field = board[row][column];
  if (!field.opened && !field.flagged) {
    field.opened = true;

    if (field.mined) {
      field.exploded = true;
    } else if (field.nearMines === 0 && depth > 0) {
      getNeighbors(board, row, column).forEach((n) =>
        openField(board, n.row, n.column, depth - 1)
      );
    }
  }
};

const fields = (board) => board.flat();

const hadExplosion = (board) => fields(board).some((field) => field.exploded);

const pending = (field) =>
  (field.mined && !field.flagged) || (!field.mined && !field.opened);

const wonGame = (board) => fields(board).every((field) => !pending(field));

const showMines = (board) =>
  fields(board)
    .filter((field) => field.mined)
    .forEach((field) => (field.opened = true));

const invertFlag = (board, row, column) => {
  const field = board[row][column];
  if (!field.opened) {
    field.flagged = !field.flagged;
  }
};

const flagsUsed = (board) =>
  fields(board).filter((field) => field.flagged).length;

const findSafePosition = (board) => {
  const rows = board.length;
  const columns = board[0].length;
  const row = Math.floor(Math.random() * rows);
  const column = Math.floor(Math.random() * columns);
  return { row, column };
};

const getMineCount = (level) => {
  const cols = params.getColumsAmount(level);
  const rows = params.getRowsAmount(level);

  if (level === 0.3) {
    return Math.ceil(cols * rows * 0.20);
  }

  return Math.ceil(cols * rows * level);
};

const getBlockSize = (level) => {
  return params.getBlockSize(
    params.getRowsAmount(level),
    params.getColumsAmount(level)
  );
};

const getLevelByRanking = (ranking) => {
  switch (ranking) {
    case 'Fácil':
      return 0.1; // Dificuldade fácil
    case 'Intermediário':
      return 0.2; // Dificuldade intermediária
    case 'Difícil':
      return 0.3; // Dificuldade difícil
    default:
      return 0.1; // Padrão para fácil
  }
};

export {
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
  getMineCount,
  getBlockSize,
  getLevelByRanking,
  findSafePosition,
};
