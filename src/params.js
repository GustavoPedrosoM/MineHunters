import { Dimensions } from 'react-native';

const params = {
  boardSize: Dimensions.get('window').width - 10, // Definir um tamanho fixo para o tabuleiro com margem
  getBlockSize(rows, cols) {
    return this.boardSize / Math.max(rows, cols);
  },
  getColumsAmount(level) {
    if (level === 0.1) return 10; // Fácil
    if (level === 0.2) return 15; // Intermediário
    if (level === 0.3) return 20; // Difícil
  },
  getRowsAmount(level) {
    if (level === 0.1) return 10; // Fácil
    if (level === 0.2) return 15; // Intermediário
    if (level === 0.3) return 20; // Difícil
  },
};

export default params;
