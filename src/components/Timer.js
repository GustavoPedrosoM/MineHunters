import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Timer = forwardRef((_props, ref) => {
  const [time, setTime] = useState(0);
  const [timerId, setTimerId] = useState(null);

  useImperativeHandle(ref, () => ({
    start() {
      if (!timerId) {
        const id = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
        setTimerId(id);
      }
    },
    stop() {
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
    },
    reset() {
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
      setTime(0);
    },
  }));

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Icon name="timer" size={24} color="white" style={styles.icon} />
      <Text style={styles.timerText}>{formatTime(time)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black', 
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    marginRight: 5,
  },
  timerText: {
    fontSize: 24,
    color: 'white',
  },
});

export default Timer;
