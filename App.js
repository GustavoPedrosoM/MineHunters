import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import { GameProvider } from './src/context/GameContext';
import InitialScreen from './src/screens/InitialScreen';
import GameScreen from './src/screens/CasualGameScreen';
import CompetitiveGameScreen from './src/screens/CompetitiveGameScreen';
import MusicPlayer from './src/MusicPlayer';

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
    // Iniciar a música ao montar o componente
    MusicPlayer.play();

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        // Retomar a música quando o app volta a ser ativo
        MusicPlayer.play();
      } else if (nextAppState.match(/inactive|background/)) {
        // Pausar a música quando o app vai para o segundo plano
        MusicPlayer.pause();
      }
    };

    
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    // Limpar listener e liberar recursos ao desmontar o componente
    return () => {
      appStateListener.remove();
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
