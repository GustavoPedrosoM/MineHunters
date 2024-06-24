import React, {useCallback} from 'react';
import { View, StyleSheet } from 'react-native';
import Field from './Field';

/*const MineField = React.memo((props) => {
  const { board, onOpenField, onSelectField } = props;
  
  const rows = board.map((row, r) => (
    <View key={r} style={styles.row}>
      {row.map((field, c) => (
        <Field {...field} key={c} onOpen={() => onOpenField(r, c)} onSelect={() => onSelectField(r, c)} />
      ))}
    </View>
  ));

  return <View style={styles.container}>{rows}</View>;
});*/

const MineField = ({ board, onOpenField, onSelectField }) => {
  const renderRow = useCallback((row, rowIndex) => (
    <View key={rowIndex} style={styles.row}>
      {row.map((field, colIndex) => (
        <Field {...field} key={colIndex} onOpen={() => onOpenField(rowIndex, colIndex)} onSelect={() => onSelectField(rowIndex, colIndex)} />
      ))}
    </View>
  ), [onOpenField, onSelectField]);

  return (
    <View style={styles.container}>
      {board.map(renderRow)}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  row: {
    flexDirection: 'row',
  },
});

export default MineField;
