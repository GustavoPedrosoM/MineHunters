import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, Menu, IconButton } from 'react-native-paper';
import Flag from './Flag';

const Header = React.memo(({ flagsLeft, onNewGame, onExit, onFlagPress }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={styles.container}>
      <View style={styles.flagContainer}>
        <TouchableOpacity style={styles.flagButton} onPress={onFlagPress}>
          <Flag bigger />
        </TouchableOpacity>
        <Text style={styles.flagsLeft}>= {flagsLeft}</Text>
      </View>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon="menu"
            color="black"
            size={30}
            onPress={openMenu}
          />
        }
      >
        <Menu.Item onPress={onNewGame} title="Novo Jogo" />
        <Menu.Item onPress={onExit} title="Sair" />
      </Menu>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagButton: {
    marginTop: 10,
    minWidth: 30,
  },
  flagsLeft: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 5,
    marginLeft: 20,
    color: 'black',
  },
});

export default Header;
