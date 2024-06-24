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
    if (nearMines === 1) color = '#0984e3';
    else if (nearMines === 2) color = '#00b894';
    else if (nearMines > 2 && nearMines < 6) color = '#ff9f43';
    else if (nearMines >= 6) color = '#EA2027';
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
    backgroundColor: '#363636',
    borderRadius: 25,
  },
  opened: {
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
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
