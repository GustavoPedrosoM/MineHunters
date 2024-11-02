// src/App.js

import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { GameProvider } from './src/context/GameContext';

import Orientation from 'react-native-orientation-locker'; // Importar a biblioteca de orientação

import InitialScreen from './src/screens/InitialScreen';
import GameScreen from './src/screens/CasualGameScreen';
import CompetitiveGameScreen from './src/screens/CompetitiveGameScreen';

import MusicPlayer from './src/MusicPlayer'; // Importar o MusicPlayer

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    // Bloquear a orientação em modo vertical
    Orientation.lockToPortrait();

    // Iniciar a música ao montar o componente
    MusicPlayer.play();

    // Limpar a orientação e liberar recursos quando o componente for desmontado
    return () => {
      Orientation.unlockAllOrientations();
      MusicPlayer.release();
    };
  }, []);

  return (
    <PaperProvider theme={theme}>
      <GameProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={InitialScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="CompetitiveGame" component={CompetitiveGameScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </PaperProvider>
  );
};

export default App;
