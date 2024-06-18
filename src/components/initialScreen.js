import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LevelSelection from '../../screens/levelSelection'; // Import the LevelSelection component

const InitialScreen = ({ navigation }) => {
  const [showLevelSelection, setShowLevelSelection] = useState(false);

  const onLevelSelected = (level) => {
    setShowLevelSelection(false);
    navigation.navigate('Game', { difficultLevel: level });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campo Minado</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowLevelSelection(true)}>
        <Text style={styles.textButton}>Jogar</Text>
      </TouchableOpacity>
      <LevelSelection
        isVisible={showLevelSelection}
        onLevelSelected={onLevelSelected}
        onCancel={() => setShowLevelSelection(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27ae60'
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#222',
  },
  button: {
    backgroundColor: '#ffda79',
    width: 100,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  textButton: {
    fontSize: 25,
    color: '#222',
    fontWeight: 'bold',
  }
});

export default InitialScreen;
