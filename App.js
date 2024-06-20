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
import LevelSelection from './screens/levelSelection'; // Importar a tela de seleção de nível
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
    const cols = params.getColumsAmount();
    const rows = params.getRowsAmount();
    return Math.ceil(cols * rows * this.props.route.params.difficultLevel);
  };

  createInitialBoard = () => {
    const cols = params.getColumsAmount();
    const rows = params.getRowsAmount();
    return createMinedBoard(rows, cols, this.minesAmount());
  };

  createState = () => {
    const cols = params.getColumsAmount();
    const rows = params.getRowsAmount();
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
    return (
      <View style={styles.container}>
        <Header
          flagsLeft={flagsLeft}
          onNewGame={() => {
            this.setState(this.createState());
          }}
          onExit={() => navigation.navigate('Home')}
        />
        <View style={styles.board}>
          <MineField
            board={board}
            onOpenField={this.onOpenField}
            onSelectField={this.onSelectField}
          />
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
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#ffda79',
  },
});

export default App;
