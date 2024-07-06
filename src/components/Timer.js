import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timer = forwardRef((props, ref) => {
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
      <Text style={styles.timerText}>{formatTime(time)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background with transparency
    padding: 10,
    borderRadius: 5,
  },
  timerText: {
    fontSize: 24,
    color: 'white',
  },
});

export default Timer;
