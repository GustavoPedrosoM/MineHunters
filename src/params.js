import { Dimensions } from 'react-native';

const params = {
  boardSize: Dimensions.get('window').width - 30, // Definir um tamanho fixo para o tabuleiro com margem
  getBlockSize(rows, cols) {
    return this.boardSize / Math.max(rows, cols);
  },
  getColumsAmount(level) {
    if (level === 0.1) return 6; // Fácil
    if (level === 0.2) return 8; // Intermediário
    if (level === 0.3) return 10; // Difícil
  },
  getRowsAmount(level) {
    if (level === 0.1) return 6; // Fácil
    if (level === 0.2) return 8; // Intermediário
    if (level === 0.3) return 10; // Difícil
  },
};

export default params;
