import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Portal, Dialog, Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GameOverDialog = React.memo(({ isVisible, onCancel, onNewGame, onExit, isWin }) => {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={onCancel} style={styles.container}>
            <LinearGradient colors={['#222', 'black']} style={styles.menu}>
              <Dialog.Title style={styles.containerTitle}>
                {isWin ? 'Parabéns, Você Venceu!' : 'Derrota, Tente Novamente!'} 
              </Dialog.Title>
              <Dialog.Content>
                <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onNewGame}>
                    <LinearGradient
                      colors={['#4cd137', '#009432']}
                      style={styles.button}>
                      <Text style={styles.textButtonMenu}>Novo Jogo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onExit}>
                    <LinearGradient
                      colors={['#eb4d4b', 'red']}
                      style={styles.button}>
                      <Text style={styles.textButtonMenu}>Menu principal</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Dialog.Content>
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
    width: screenWidth * 0.8,
    height: screenHeight * 0.35,
  },
  containerTitle: {
    color: 'white',
    fontFamily: 'SpicyRice-Regular',
    fontSize: screenWidth * 0.045,
    marginTop: screenHeight * 0.03,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    marginTop: 23,
  },
  button: {
    width: screenWidth * 0.6,
    height: screenHeight * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  textButtonMenu: {
    color: 'white',
    fontFamily: 'SpicyRice-Regular',
    fontSize: screenWidth * 0.045,
  },
});

export default GameOverDialog;
