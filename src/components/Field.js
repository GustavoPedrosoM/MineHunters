import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

import params from '../params';
import Mine from './Mine';
import Flag from './Flag';

const Field = React.memo((props) => {
  const { mined, opened, nearMines, exploded, flagged, onOpen, onSelect } = props;

  const styleField = [styles.field, 
    opened ? styles.opened : styles.regular, 
    exploded && styles.exploded, 
    flagged && !opened && styles.flagged];

  let color = null;
  if (nearMines > 0) {
    if (nearMines === 1) color = '#2A28D7';
    else if (nearMines === 2) color = '#2B520F';
    else if (nearMines > 2 && nearMines < 6) color = '#F9060A';
    else if (nearMines >= 6) color = '#F221A9';
  }

  return (
    <TouchableWithoutFeedback onPress={onOpen} onLongPress={onSelect}>
      <View style={styleField}>
        {!mined && opened && nearMines > 0 && (
          <Text style={[styles.label, { color }]}>{nearMines}</Text>
        )}
        {mined && opened && <Mine />}
        {flagged && !opened && <Flag />}
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  field: {
    height: params.blockSize,
    width: params.blockSize,
    borderWidth: params.borderSize,
  },
  regular: {
    backgroundColor: '#009432',
    borderLeftColor: '#20bf6b',
    borderTopColor: '#20bf6b',
    borderRightColor: '#333',
    borderBottomColor: '#333',
  },
  opened: {
    backgroundColor: '#ffda79',
    borderColor: '#ccae62',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: params.fontSize,
  },
  exploded: {
    backgroundColor: '#EA2027',
    borderColor: '#EA2027',
  },
});

export default Field;
