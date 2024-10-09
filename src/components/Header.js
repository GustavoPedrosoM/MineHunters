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
              <Dialog.Title style={styles.containerTitle}>Pausado</Dialog.Title>
              <Dialog.Content>
                <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleNewGame}>
                    <LinearGradient
                      colors={['#72a34d', '#527a33']}
                      style={styles.button}>
                      <Text style={styles.textButtonMenu}>Novo Jogo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleExit}>
                    <LinearGradient
                      colors={['#e55039', '#b33939']}
                      style={styles.button}>
                      <Text style={styles.textButtonMenu}>Menu principal</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button style={styles.buttonCancel} onPress={closeMenu}><Text style={styles.textButtonMenu}>Cancelar</Text></Button>
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
    alignItems: 'center',
  },
  containerTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
  menu: {
    borderRadius: 20,
    height: 350,
    width: 350,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  textButtonMenu: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonCancel: {
    marginTop: 15,
  },
});

export default Header;
