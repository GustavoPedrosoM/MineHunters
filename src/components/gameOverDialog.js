import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Portal, Dialog } from 'react-native-paper';

const GameOverDialog = React.memo(({ isVisible, onCancel, onNewGame, onExit, isWin }) => {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onCancel} style={styles.container}>
        <Dialog.Title style={styles.containerTitle}>
          {isWin ? 'Parabéns, Você Venceu!' : 'Derrota, Tente Novamente!'}
        </Dialog.Title>
        <Dialog.Content>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={[styles.button, styles.newGameButton]}
              onPress={onNewGame}
            >
              Novo Jogo
            </Button>
            <Button
              mode="contained"
              style={[styles.button, styles.exitButton]}
              onPress={onExit}
            >
              Sair
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
    backgroundColor: '#333',
  },
  containerTitle: {
    color: '#ffda79',
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
  newGameButton: {
    backgroundColor: '#49b65d',
  },
  exitButton: {
    backgroundColor: '#F26337',
  },
});

export default GameOverDialog;
