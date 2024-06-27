import React, { Component } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

import params from './src/params';
import MineField from './src/components/MineField';
import Header from './src/components/Header';
import InitialScreen from './src/components/initialScreen';
import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
} from './src/functions';

const Stack = createStackNavigator();

class GameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = this.createState();
  }

  minesAmount = () => {
    const cols = params.getColumsAmount(this.props.route.params.difficultLevel);
    const rows = params.getRowsAmount(this.props.route.params.difficultLevel);
    const level = this.props.route.params.difficultLevel;
    let proportion = level;

    // Ajustar a proporção de minas para o nível difícil
    if (level === 0.3) {
      proportion = 0.15; // Reduzir a proporção de minas para o nível difícil
    }

    return Math.ceil(cols * rows * proportion);
  };

  createInitialBoard = () => {
    const cols = params.getColumsAmount(this.props.route.params.difficultLevel);
    const rows = params.getRowsAmount(this.props.route.params.difficultLevel);
    return createMinedBoard(rows, cols, this.minesAmount());
  };

  createState = () => {
    const cols = params.getColumsAmount(this.props.route.params.difficultLevel);
    const rows = params.getRowsAmount(this.props.route.params.difficultLevel);
    return {
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
    };
  };

  componentDidMount() {
    this.setState(this.createState());
  }

  onOpenField = (row, column) => {
    const { board } = this.state;
    const newBoard = cloneBoard(board);
    openField(newBoard, row, column);
    const lost = hadExplosion(newBoard);
    const won = wonGame(newBoard);

    if (lost) {
      showMines(newBoard);
      Alert.alert(
        'Derrota',
        'Oops! Você perdeu o jogo. Tente novamente!',
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState(this.createState());
            },
          },
        ],
        { cancelable: false }
      );
    }

    if (won) {
      Alert.alert(
        'Vitória',
        'Parabéns! Você venceu o jogo!',
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState(this.createState());
            },
          },
        ],
        { cancelable: false }
      );
    }

    this.setState({ board: newBoard, lost, won });
  };

  onSelectField = (row, column) => {
    const { board } = this.state;
    const newBoard = cloneBoard(board);
    invertFlag(newBoard, row, column);
    const won = wonGame(newBoard);

    if (won) {
      Alert.alert(
        'Parabéns',
        'Você venceu o jogo!',
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState(this.createState());
            },
          },
        ],
        { cancelable: false }
      );
    }

    this.setState({ board: newBoard, won });
  };

  render() {
    const { navigation } = this.props;
    const { board } = this.state;
    const flagsLeft = this.minesAmount() - flagsUsed(board);
    const blockSize = params.getBlockSize(params.getRowsAmount(this.props.route.params.difficultLevel), params.getColumsAmount(this.props.route.params.difficultLevel));

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header
            flagsLeft={flagsLeft}
            onNewGame={() => {
              this.setState(this.createState());
            }}
            onExit={() => navigation.navigate('Home')}
          />
        </View>
        <View style={styles.boardContainer}>
          <View style={[styles.board, { width: params.boardSize, height: params.boardSize }]}>
            <MineField
              board={board}
              onOpenField={this.onOpenField}
              onSelectField={this.onSelectField}
              blockSize={blockSize}
            />
          </View>
        </View>
      </View>
    );
  }
}

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={InitialScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  boardContainer: {
    flex: 9,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
  },
  board: {
    backgroundColor: '#333',
  },
});

export default App;
