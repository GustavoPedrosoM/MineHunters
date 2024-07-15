// src/components/Field.js
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
        {mined && opened && <Mine blockSize={blockSize} />}
        {flagged && !opened && (
          <View style={styles.flagContainer}>
            <Flag blockSize={blockSize} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  field: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 15,
  },
  regular: {
    backgroundColor: '#A0522D',
    borderTopColor: '#F4A460',
    borderLeftColor: '#F4A460', 
    borderRightColor: '#8B4513',
    borderBottomColor: '#8B4513',
    borderRadius: 10,
  },
  opened: {
    backgroundColor: '#DEB887',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: '#F5DEB3',
  },
  label: {
    fontWeight: 'bold',
  },
  exploded: {
    backgroundColor: '#e74c3c',
    borderColor: '#c0392b',
  },
  flagContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Field;
