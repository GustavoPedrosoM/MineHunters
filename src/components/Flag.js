import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Flag = React.memo(({ blockSize }) => {
  const iconSize = blockSize && !isNaN(blockSize) ? blockSize * 0.6 : 16;

  return (
    <View style={[styles.container, { width: blockSize, height: blockSize }]}>
      <Icon
        name="flag-variant"
        size={iconSize ? 26 : 16} 
        color="#000" 
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Flag;
