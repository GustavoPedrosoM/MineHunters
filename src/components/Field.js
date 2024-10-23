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
    if (nearMines === 1) color = '#14c9c3';
    else if (nearMines === 2) color = '#12c70c';
    else if (nearMines === 3) color = '#ffc505';
    else if (nearMines === 4) color = '#a115d4';
    else if (nearMines >= 5) color = '#cf0000';
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
    backgroundColor: '#108500',
    borderTopColor: '#2aa11a',
    borderLeftColor: '#2aa11a', 
    borderRightColor: '#0c6600',
    borderBottomColor: '#0c6600',
    borderRadius: 10,
  },
  opened: {
    backgroundColor: '#402b01',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: '#2e1e00',
  },
  label: {
    fontWeight: 'bold',
  },
  exploded: {
    backgroundColor: '#d90000',
    borderColor: '#b50000',
  },
  flagContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Field;
