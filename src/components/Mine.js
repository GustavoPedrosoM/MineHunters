import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Mine = React.memo(({ blockSize }) => {
  const iconSize = blockSize && !isNaN(blockSize) ? blockSize * 0.6 : 16;

  return (
    <View style={[styles.container, { width: blockSize, height: blockSize }]}>
      <Icon
        name="bomb"
        size={iconSize} 
        color="black" 
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

export default Mine;
