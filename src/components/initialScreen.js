import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Text, Button, Modal, Portal } from 'react-native-paper';
import LevelSelection from '../../screens/levelSelection';

const InitialScreen = ({ navigation }) => {
  const [showLevelSelection, setShowLevelSelection] = useState(false);

  const onLevelSelected = useCallback((level) => {
    setShowLevelSelection(false);
    navigation.navigate('Game', { difficultLevel: level });
  }, [navigation]);

  return (
    <ImageBackground source={require('../assets/images/op1.png')} style={styles.background} >
      <View style={styles.container}>
        <Button mode="contained" style={styles.playButton} onPress={() => setShowLevelSelection(true)}>
          <Text style={styles.textPlayButton}>JOGAR</Text>
        </Button>
        <Portal>
          <Modal visible={showLevelSelection} onDismiss={() => setShowLevelSelection(false)}>
            <LevelSelection 
              isVisible={showLevelSelection} 
              onLevelSelected={onLevelSelected} 
              onCancel={() => setShowLevelSelection(false)} 
            />
          </Modal>
        </Portal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  playButton: {
    marginBottom: 100, // Ajuste conforme necessário para manter o botão na mesma altura
    width: 100, // Diminuir a largura do botão
    backgroundColor: '#20bf6b',
  },
  textPlayButton: {
    fontSize: 15, // Aumentar o tamanho da fonte
    fontWeight: 'bold',
    color: 'white',
  },
});

export default React.memo(InitialScreen);
