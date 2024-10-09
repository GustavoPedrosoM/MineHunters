import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Portal, Dialog, Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const GameOverDialog = React.memo(({ isVisible, onCancel, onNewGame, onExit, isWin }) => {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onCancel} style={styles.container}>
            <LinearGradient colors={['#2f3640', '#222']} style={styles.menu}>
              <Dialog.Title style={styles.containerTitle}>
                {isWin ? 'Parabéns, Você Venceu!' : 'Derrota, Tente Novamente!'} 
              </Dialog.Title>
              <Dialog.Content>
                <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onNewGame}>
                    <LinearGradient
                      colors={['#72a34d', '#527a33']}
                      style={styles.button}>
                      <Text style={styles.textButtonMenu}>Novo Jogo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onExit}>
                    <LinearGradient
                      colors={['#e55039', '#b33939']}
                      style={styles.button}>
                      <Text style={styles.textButtonMenu}>Menu principal</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
          <Button onPress={onCancel}><Text style={styles.buttonCancel}>Cancelar</Text></Button>
        </Dialog.Actions>
              </LinearGradient>
      </Dialog>
    </Portal>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    alignItems: 'center',
  },
  menu: {
    borderRadius: 20, 
    overflow: 'hidden',
    height: 400,
    width: 400,
  },
  containerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    marginTop: 50,
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  textButtonMenu: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  buttonCancel: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GameOverDialog;
