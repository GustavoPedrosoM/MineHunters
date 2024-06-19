import React, { useState } from 'react';
import { View, StyleSheet} from 'react-native';
import { useFonts } from 'expo-font';
import { Text, Button, Modal, Portal } from 'react-native-paper';
import LevelSelection from '../../screens/levelSelection';


const InitialScreen = ({ navigation }) => {
  const [showLevelSelection, setShowLevelSelection] = useState(false);

  const onLevelSelected = (level) => {
    setShowLevelSelection(false);
    navigation.navigate('Game', { difficultLevel: level });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MegaMine Adventure</Text>
      <Text style={styles.subtitle}>Campo Minado</Text>
      <Button mode="contained" style={styles.playButton} onPress={() => setShowLevelSelection(true)}>
        Jogar
      </Button>
      <Button mode="outlined" style={styles.Button} onPress={() => navigation.navigate('Home')}>
        Loja
      </Button>
      <Button mode="outlined" style={styles.Button} onPress={() => navigation.navigate('Home')}>
      Configurações
      </Button>
      <Button mode="outlined" style={styles.Button} onPress={() => navigation.navigate('Home')}>
        Sair
      </Button>
      <Portal>
        <Modal visible={showLevelSelection} onDismiss={() => setShowLevelSelection(false)}>
          <LevelSelection onLevelSelected={onLevelSelected} onCancel={() => setShowLevelSelection(false)} />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', // Fundo escuro
  },
  title: {
    fontSize: 50,
    fontFamily: 'Jaini-Regular',
    color: '#ffda79', // Amarelo vibrante
  },
  subtitle: {
    fontSize: 30,
    fontFamily: 'Jaini-Regular',
    marginBottom: 40,
    color: '#ffda79',
  },
  playButton: {
    marginTop: 20,
    width: 150,
    backgroundColor: '#2ecc71', // Verde vibrante
  },
  Button: {
    marginTop: 10,
    width: 150,
    borderColor: '#ffda79', // Amarelo vibrante
  },
});

export default InitialScreen;
