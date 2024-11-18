import { Dimensions } from 'react-native';

// Configuração de parâmetros do tabuleiro
const boardSize = Dimensions.get('window').width - 30;

const levelDimensions = {
  0.1: { columns: 6, rows: 6 },
  0.2: { columns: 8, rows: 8 },
  0.3: { columns: 10, rows: 10 },
}; // colunas e linhas do tabuleiro de acordo com os níveis

// Funções utilitárias para tamanhos de blocos e nível

//calcula o tamanho de cada bloco para o tabuleiro 
const getBlockSize = (level) => {
  const { columns, rows } = levelDimensions[level] || { columns: 6, rows: 6 };
  return boardSize / Math.max(rows, columns);
};

// retorna uma quantidade de colunas do tabuleiro com base no nível de dificuldade
const getColumsAmount = (level) => {
  return levelDimensions[level]?.columns || 6;
};

// retorna o número de linhas com base no nível de dificuldade
const getRowsAmount = (level) => {
  return levelDimensions[level]?.rows || 6;
};

// estipula o número de minas do tabuleiro para cada nível 
const getMineCount = (level) => {
  const mineCount = level === 0.1 ? 5 : level === 0.2 ? 12 : level === 0.3 ? 20 : Math.ceil(getColumsAmount(level) * getRowsAmount(level) * level);
  return mineCount;
};

// Função cria e retorna um tabuleiro vazio
const createBoard = (rows, columns) => {
  console.log(`Criando tabuleiro com ${rows} linhas e ${columns} colunas`);
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, column) => ({ // criando uma matriz bidimensional 
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

// espalha as minas pelo tabuleiro 
const spreadMines = (board, minesAmount, excludedPositions = []) => {
  console.log(`Espalhando ${minesAmount} minas`);
  const flatBoard = board.flat(); // achata o tabuleiro
  const excludeKeys = new Set(excludedPositions.map(pos => `${pos.row},${pos.column}`));
  let minesPlanted = 0;

  // implanta as minas aleatóriamente 
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

// combina createBoard com spreadMines para criar um tabuleiro completo
const createMinedBoard = (rows, columns, minesAmount) => {
  const board = createBoard(rows, columns);
  spreadMines(board, minesAmount);
  return board;
};

// percorre cada campo do tabuleiro, filtra os viznhos com minas e atualiza o "NearMines" de cada célula 
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

// clona o tabuleiro 
const cloneBoard = (board) => {
  return board.map(rows => rows.map(field => ({ ...field }))); // cria uma nova matriz de objetos
};

// abre um campo no tabuleiro, se não há minas próximas, abre recursivamente outros campos até um limite de profundidade
const openField = (board, row, column, depth = Infinity) => {
  const field = board[row][column];
  if (!field.opened && !field.flagged) {
    field.opened = true;

    if (field.mined) {
      field.exploded = true;
      console.log(`Campo em (${row}, ${column}) explodiu!`);
    } else if (field.nearMines === 0 && depth > 0) {
      getNeighbors(board, row, column).forEach(n => openField(board, n.row, n.column, depth - 1));
    }
  }
};

// percorre uma matriz 3x3 em volta de uma célula e retorna os vizinhos em uma lista
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

// retorna uma lista de todos os campos do tabuleiro
const fields = (board) => board.flat();

// verifica usando fields, se há alguma célula do campo marcada com exploded
const hadExplosion = (board) => {
  const explosionOccurred = fields(board).some(field => field.exploded);
  return explosionOccurred;
};

// determina se algum campo está pendente, 
// se há algum campo com mina que não foi marcado com uma bandeira ou algum campo sem mina que não foi aberto
const pending = (field) => (field.mined && !field.flagged) || (!field.mined && !field.opened);

// determina se o jogador venceu o jogo
const wonGame = (board) => {
  const won = fields(board).every(field => !pending(field));
  console.log(`Condição de vitória verificada: ${won}`);
  return won;
};

// mostra todas as minas do jogo
const showMines = (board) => {
  fields(board).filter(field => field.mined).forEach(field => (field.opened = true));
};

// alterna o estado da bandeira 
const invertFlag = (board, row, column) => {
  const field = board[row][column];
  if (!field.opened) {
    field.flagged = !field.flagged;
    console.log(`Bandeira ${field.flagged ? 'marcada' : 'desmarcada'} em (${row}, ${column})`);
  }
};

// conta o número de bandeiras usadas no tabuleiro
const flagsUsed = (board) => {
  const usedFlags = fields(board).filter(field => field.flagged).length;
  console.log(`Número de bandeiras usadas: ${usedFlags}`);
  return usedFlags;
};

// encontra uma posição segura para abrir o tabuleiro 
const findSafePosition = (board) => {
  const rows = board.length;
  const columns = board[0].length;
  let row, column;
  do {
    row = Math.floor(Math.random() * rows);
    column = Math.floor(Math.random() * columns);
  } while (board[row][column].mined || board[row][column].nearMines > 0);
  return { row, column };
};

// mapeia os rankings do modo competitivo retornando valores de 0.1, 0.2 ou  0.3
const getLevelFromRanking = (ranking) => {
  if (ranking === 'Iniciante') return 0.1; // Fácil
  if (ranking === 'Amador') return 0.2; // Intermediário
  return 0.3; // Difícil para "Especialista" e "Rei do Campo Minado"
};

export {
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
