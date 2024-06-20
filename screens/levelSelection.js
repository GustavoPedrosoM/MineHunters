import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Portal, Dialog } from 'react-native-paper';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const LevelSelection = React.memo((props) => {
  const { isVisible, onCancel, onLevelSelected } = props;

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onCancel} style={styles.container}>
        <Dialog.Title style={styles.containerTitle}>Selecione o Nível</Dialog.Title>
        <Dialog.Content>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={[styles.button, styles.bgEasy]}
              onPress={() => onLevelSelected(0.1)}
            >
              Fácil
            </Button>
            <Button
              mode="contained"
              style={[styles.button, styles.bgNormal]}
              onPress={() => onLevelSelected(0.2)}
            >
              Intermediário
            </Button>
            <Button
              mode="contained"
              style={[styles.button, styles.bgHard]}
              onPress={() => onLevelSelected(0.3)}
            >
              Difícil
            </Button>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Cancelar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333'
  },
  containerTitle: {
    color: '#ffda79'
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
    width: '80%',
  },
  bgEasy: {
    backgroundColor: '#49b65d',
  },
  bgNormal: {
    backgroundColor: '#2765F7',
  },
  bgHard: {
    backgroundColor: '#F26337',
  },
});

export default LevelSelection;
