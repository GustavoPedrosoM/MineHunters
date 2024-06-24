import { Dimensions } from 'react-native';

const params = {
  blockSize: 45,
  borderSize: 2,
  fontSize: 17,
  headerRatio: 0.15, // Proporção do painel superior na tela
  getColumsAmount() {
    const width = Dimensions.get('window').width;
    return Math.floor(width / this.blockSize);
  },
  getRowsAmount() {
    const totalHeight = Dimensions.get('window').height;
    const boardHeight = totalHeight * (1 - this.headerRatio);
    return Math.floor(boardHeight / this.blockSize);
  },
};

export default params;
