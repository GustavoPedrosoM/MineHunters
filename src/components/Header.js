import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {Button} from 'react-native-paper';
import Flag from './Flag';

const Header = React.memo(({ flagsLeft, onNewGame, onExit, onFlagPress }) => (
  <View style={styles.container}>
    <View style={styles.flagContainer}>
      <TouchableOpacity style={styles.flagButton} onPress={onFlagPress}>
        <Flag bigger />
      </TouchableOpacity>
      <Text style={styles.flagsLeft}>= {flagsLeft}</Text>
    </View>
    <Button mode="outlined" style={styles.button} onPress={onNewGame}>
            Novo Jogo
    </Button>
    <Button mode="outlined" style={styles.button} onPress={onExit}>
            Sair
    </Button>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  flagContainer: {
    flexDirection: 'row',
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
  button: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
    borderColor: '#ffda79',
  },
});

export default Header;
