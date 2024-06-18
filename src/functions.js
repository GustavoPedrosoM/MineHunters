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

const spreadMines = (board, minesAmount) => {
  const rows = board.length;
  const columns = board[0].length;
  let minesPlanted = 0;

  while (minesPlanted < minesAmount) {
    const rowSel = Math.floor(Math.random() * rows);
    const columnSel = Math.floor(Math.random() * columns);

    if (!board[rowSel][columnSel].mined) {
      board[rowSel][columnSel].mined = true;
      minesPlanted++;
    }
  }
};

const createMinedBoard = (rows, columns, minesAmount) => {
  const board = createBoard(rows, columns);
  spreadMines(board, minesAmount);
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
  field.flagged = !field.flagged;
};

const flagsUsed = (board) => fields(board).filter(field => field.flagged).length;

export { 
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed
};
