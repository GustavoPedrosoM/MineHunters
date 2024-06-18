import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Flag from './Flag';

const Header = React.memo(({ flagsLeft, onNewGame, onExit, onFlagPress }) => (
  <View style={styles.container}>
    <View style={styles.flagContainer}>
      <TouchableOpacity style={styles.flagButton} onPress={onFlagPress}>
        <Flag bigger />
      </TouchableOpacity>
      <Text style={styles.flagsLeft}>= {flagsLeft}</Text>
    </View>
    <TouchableOpacity style={styles.button} onPress={onNewGame}>
      <Text style={styles.buttonLabel}>Novo Jogo</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={onExit}>
      <Text style={styles.buttonLabel}>Sair</Text>
    </TouchableOpacity>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#74b9ff',
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
    backgroundColor: '#ffda79',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonLabel: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Header;
