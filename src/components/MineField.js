import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Field from './Field';

const MineField = ({ board, onOpenField, onSelectField, blockSize }) => {
  const renderRow = useCallback(
    (row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((field, colIndex) => (
          <Field
            {...field}
            key={colIndex}
            onOpen={() => onOpenField(rowIndex, colIndex)}
            onSelect={() => onSelectField(rowIndex, colIndex)}
            blockSize={blockSize}
          />
        ))}
      </View>
    ),
    [onOpenField, onSelectField, blockSize]
  );

  return <View style={styles.container}>{board.map(renderRow)}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
  },
});

export default React.memo(MineField);
