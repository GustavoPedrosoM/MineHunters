import { Dimensions } from 'react-native';

// Configuração de parâmetros do tabuleiro
const boardSize = Dimensions.get('window').width - 30;

const levelDimensions = {
  0.1: { columns: 6, rows: 6 },
  0.2: { columns: 8, rows: 8 },
  0.3: { columns: 10, rows: 10 },
}; // colunas e linhas do tabuleiro de acordo com os níveis

// Funções utilitárias para tamanhos de blocos e nível
const getBlockSize = (level) => {
  const { columns, rows } = levelDimensions[level] || { columns: 6, rows: 6 };
  console.log(`Tamanho do bloco calculado: ${boardSize / Math.max(rows, columns)}`);
  return boardSize / Math.max(rows, columns);
};

const getColumsAmount = (level) => {
  console.log(`Número de colunas para nível ${level}: ${levelDimensions[level]?.columns || 6}`);
  return levelDimensions[level]?.columns || 6;
};
const getRowsAmount = (level) => {
  console.log(`Número de linhas para nível ${level}: ${levelDimensions[level]?.rows || 6}`);
  return levelDimensions[level]?.rows || 6;
};

const getMineCount = (level) => {
  const mineCount = level === 0.1 ? 5 : level === 0.2 ? 12 : level === 0.3 ? 20 : Math.ceil(getColumsAmount(level) * getRowsAmount(level) * level);
  console.log(`Número de minas para nível ${level}: ${mineCount}`);
  return mineCount;
};

// Funções de criação e configuração do tabuleiro
const createBoard = (rows, columns) => {
  console.log(`Criando tabuleiro com ${rows} linhas e ${columns} colunas`);
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
  console.log(`Espalhando ${minesAmount} minas, com exclusão de posições: ${excludedPositions.map(pos => `(${pos.row},${pos.column})`)}`);
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
      console.log(`Mina plantada em (${cell.row}, ${cell.column})`);
    }
  }
};

const createMinedBoard = (rows, columns, minesAmount) => {
  console.log(`Criando tabuleiro com minas: ${minesAmount} minas, ${rows}x${columns} dimensões`);
  const board = createBoard(rows, columns);
  spreadMines(board, minesAmount);
  return board;
};

const calculateNearMines = (board) => {
  console.log('Calculando minas próximas para cada campo');
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      const field = board[row][column];
      field.nearMines = getNeighbors(board, row, column).filter(n => n.mined).length;
      console.log(`Minas próximas ao campo (${row}, ${column}): ${field.nearMines}`);
    }
  }
};

// Funções de manipulação de estado do tabuleiro
const cloneBoard = (board) => {
  console.log('Clonando o tabuleiro');
  return board.map(rows => rows.map(field => ({ ...field })));
};

const openField = (board, row, column, depth = Infinity) => {
  const field = board[row][column];
  if (!field.opened && !field.flagged) {
    field.opened = true;
    console.log(`Campo aberto em (${row}, ${column}) com profundidade ${depth}`);

    if (field.mined) {
      field.exploded = true;
      console.log(`Campo em (${row}, ${column}) explodiu!`);
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
  console.log(`Vizinhos do campo (${row}, ${column}): ${neighbors.length} encontrados`);
  return neighbors;
};

const fields = (board) => board.flat();

const hadExplosion = (board) => {
  const explosionOccurred = fields(board).some(field => field.exploded);
  console.log(`Explosão ocorreu: ${explosionOccurred}`);
  return explosionOccurred;
};

const pending = (field) => (field.mined && !field.flagged) || (!field.mined && !field.opened);

const wonGame = (board) => {
  const won = fields(board).every(field => !pending(field));
  console.log(`Condição de vitória verificada: ${won}`);
  return won;
};

const showMines = (board) => {
  console.log('Revelando todas as minas');
  fields(board).filter(field => field.mined).forEach(field => (field.opened = true));
};

const invertFlag = (board, row, column) => {
  const field = board[row][column];
  if (!field.opened) {
    field.flagged = !field.flagged;
    console.log(`Bandeira ${field.flagged ? 'marcada' : 'desmarcada'} em (${row}, ${column})`);
  }
};

const flagsUsed = (board) => {
  const usedFlags = fields(board).filter(field => field.flagged).length;
  console.log(`Número de bandeiras usadas: ${usedFlags}`);
  return usedFlags;
};

const findSafePosition = (board) => {
  const rows = board.length;
  const columns = board[0].length;
  let row, column;
  do {
    row = Math.floor(Math.random() * rows);
    column = Math.floor(Math.random() * columns);
  } while (board[row][column].mined || board[row][column].nearMines > 0);
  console.log(`Posição segura encontrada em (${row}, ${column})`);
  return { row, column };
};

const getLevelFromRanking = (ranking) => {
  if (ranking === 'Iniciante') return 0.1; // Fácil
  if (ranking === 'Amador') return 0.2; // Intermediário
  return 0.3; // Difícil para "Especialista" e "Rei do Campo Minado"
};

// Exportação das Funções
export {
  boardSize,
  getBlockSize,
  getColumsAmount,
  getRowsAmount,
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
  getLevelFromRanking,
};
