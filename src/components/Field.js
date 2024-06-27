import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import Mine from './Mine';
import Flag from './Flag';

const Field = React.memo((props) => {
  const { mined, opened, nearMines, exploded, flagged, onOpen, onSelect, blockSize } = props;

  const styleField = [
    styles.field,
    opened ? styles.opened : styles.regular,
    exploded && styles.exploded,
    flagged && !opened && styles.flagged,
    { width: blockSize, height: blockSize, borderWidth: blockSize / 15 },
  ];

  let color = null;
  if (nearMines > 0) {
    if (nearMines === 1) color = '#0984e3';
    else if (nearMines === 2) color = '#00b894';
    else if (nearMines > 2 && nearMines < 6) color = '#ff9f43';
    else if (nearMines >= 6) color = '#EA2027';
  }

  return (
    <TouchableWithoutFeedback onPress={onOpen} onLongPress={onSelect}>
      <View style={styleField}>
        {!mined && opened && nearMines > 0 && (
          <Text style={[styles.label, { color, fontSize: blockSize / 2 }]}>{nearMines}</Text>
        )}
        {mined && opened && <Mine />}
        {flagged && !opened && <Flag />}
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  field: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  regular: {
    backgroundColor: '#444',
    borderColor: '#888',
    borderRadius: 8,
    borderWidth: 2,
  },
  opened: {
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: '#bbb',
  },
  label: {
    fontWeight: 'bold',
  },
  exploded: {
    backgroundColor: '#ff6666',
    borderColor: '#ff6666',
  },
  flagged: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
});

export default Field;
