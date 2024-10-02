import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, Portal, Dialog } from 'react-native-paper';
import { BlurView } from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Flag from './Flag';
import Timer from './Timer';
import LinearGradient from 'react-native-linear-gradient';

const Header = React.memo(({ flagsLeft, onNewGame, onExit, onFlagPress, timerRef }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => {
    timerRef.current.stop();
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    timerRef.current.start();
  };

  const handleNewGame = () => {
    closeMenu();
    onNewGame();
  };

  const handleExit = () => {
    closeMenu();
    onExit();
  };

  return (
    <LinearGradient colors={['#72a34d', '#527a33']} >
    <View style={styles.container}>
      <View style={styles.flagContainer}>
        <TouchableOpacity style={styles.flagButton} onPress={onFlagPress}>
          <Flag bigger={true} />
        </TouchableOpacity>
        <Text style={styles.flagsLeft}>= {flagsLeft}</Text>
      </View>
      <View style={styles.timerContainer}>
        <Timer ref={timerRef} style={styles.timer} />
      </View>
      
      <TouchableOpacity onPress={openMenu} style={styles.iconButton}>
        <Icon
          name="pause-circle"
          size={45}
          color="white"
        />
      </TouchableOpacity>
      <Portal>
            <Dialog visible={menuVisible} onDismiss={closeMenu} style={styles.dialogContainer}>
            <LinearGradient colors={['#2f3640', '#222']} style={styles.menu}>
              <Dialog.Title style={styles.dialogTitle}>Menu</Dialog.Title>
              <Dialog.Content>
                <View style={styles.buttonContainer}>
                  <Button mode="contained" style={[styles.button, styles.newGameButton]} onPress={handleNewGame}>
                    Novo Jogo
                  </Button>
                  <Button mode="contained" style={[styles.button, styles.exitButton]} onPress={handleExit}>
                    Sair
                  </Button>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={closeMenu}>Cancelar</Button>
              </Dialog.Actions>
              </LinearGradient>
            </Dialog>
      </Portal>
    </View>
    </LinearGradient>
    
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    padding: 5,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagButton: {
    marginLeft: 10,
  },
  flagsLeft: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  iconButton: {
    padding: 5,
  },
  timer: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerIcon: {
    marginLeft: 5,
  },
  dialogContainer: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
  },
  menu: {
    borderRadius: 20,
  },
  dialogTitle: {
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

export default Header;
