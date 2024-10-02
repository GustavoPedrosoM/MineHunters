import { Dimensions } from 'react-native';

const params = {
  boardSize: Dimensions.get('window').width - 30, // Definir um tamanho fixo para o tabuleiro com margem
  getBlockSize(rows, cols) {
    return this.boardSize / Math.max(rows, cols);
  },
  getColumsAmount(level) {
    if (level === 0.1) return 7; // Fácil
    if (level === 0.2) return 9; // Intermediário
    if (level === 0.3) return 12; // Difícil
  },
  getRowsAmount(level) {
    if (level === 0.1) return 7; // Fácil
    if (level === 0.2) return 9; // Intermediário
    if (level === 0.3) return 12; // Difícil
  },
};

export default params;
