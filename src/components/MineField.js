import React from 'react';
import { View, StyleSheet } from 'react-native';
import Field from './Field';

const MineField = React.memo((props) => {
  const { board, onOpenField, onSelectField } = props;
  
  const rows = board.map((row, r) => (
    <View key={r} style={styles.row}>
      {row.map((field, c) => (
        <Field {...field} key={c} onOpen={() => onOpenField(r, c)} onSelect={() => onSelectField(r, c)} />
      ))}
    </View>
  ));

  return <View style={styles.container}>{rows}</View>;
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEE',
  },
  row: {
    flexDirection: 'row',
  },
});

export default MineField;
