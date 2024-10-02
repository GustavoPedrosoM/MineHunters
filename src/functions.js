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

const spreadMines = (board, minesAmount, excludeRow, excludeColumn) => {
  const flatBoard = board.flat();
  let minesPlanted = 0;

  while (minesPlanted < minesAmount) {
    const randomIndex = Math.floor(Math.random() * flatBoard.length);
    const cell = flatBoard[randomIndex];

    if (!cell.mined && (cell.row !== excludeRow || cell.column !== excludeColumn)) {
      cell.mined = true;
      minesPlanted++;
    }
  }
};

const createMinedBoard = (rows, columns, minesAmount) => {
  const board = createBoard(rows, columns);
  return board;
};

const cloneBoard = (board) => board.map(rows => rows.map(field => ({ ...field })));

const getNeighbors = (board, row, column) => {
  const neighbors = [];
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = column - 1; c <= column + 1; c++) {
      if (r >= 0 && r < board.length && c >= 0 && c < board[0].length && (r !== row || c !== column)) {
        neighbors.push(board[r][c]);
      }
    }
  }
  return neighbors;
};

const safeNeighborhood = (board, row, column) => 
  getNeighbors(board, row, column).every(neighbor => !neighbor.mined);

const openField = (board, row, column) => {
  const field = board[row][column];
  if (!field.opened) {
    field.opened = true;
    if (field.mined) {
      field.exploded = true;
    } else if (safeNeighborhood(board, row, column)) {
      getNeighbors(board, row, column).forEach(n => openField(board, n.row, n.column));
    } else {
      field.nearMines = getNeighbors(board, row, column).filter(n => n.mined).length;
    }
  }
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

// Função para calcular a quantidade de minas com base no nível de dificuldade
const getMineCount = (level) => {
  const cols = params.getColumsAmount(level);
  const rows = params.getRowsAmount(level);
  return Math.ceil(cols * rows * level);
};

// Função para obter o tamanho dos blocos
const getBlockSize = (level) => {
  return params.getBlockSize(
    params.getRowsAmount(level),
    params.getColumsAmount(level)
  );
};

// Função para mapear o ranking para o nível de dificuldade correspondente
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
  getLevelByRanking
};
