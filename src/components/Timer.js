// src/components/Timer.js

import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const formatTime = (time) => {
  if (time === null || time === undefined) return '-';
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Timer = forwardRef(({ countdown = null, onCountdownFinish }, ref) => {
  const [time, setTime] = useState(countdown !== null ? countdown : 0);
  const timerIdRef = useRef(null);

  useImperativeHandle(ref, () => ({
    start() {
      if (!timerIdRef.current) {
        console.log('Timer iniciado');
        timerIdRef.current = setInterval(() => {
          setTime((prevTime) => {
            if (countdown !== null) {
              if (prevTime > 0) {
                return prevTime - 1;
              } else {
                clearInterval(timerIdRef.current);
                timerIdRef.current = null;
                if (onCountdownFinish) {
                  onCountdownFinish();
                }
                return 0;
              }
            } else {
              return prevTime + 1;
            }
          });
        }, 1000);
      } else {
        console.log('Timer já está rodando');
      }
    },
    stop() {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
        console.log('Timer parado');
      } else {
        console.log('Timer já está parado');
      }
    },
    reset() {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
        console.log('Timer resetado e parado');
      } else {
        console.log('Timer resetado');
      }
      setTime(countdown !== null ? countdown : 0);
    },
    getTime() {
      return time;
    },
  }));

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Icon name="timer" size={30} color="white" style={styles.icon} />
      <Text style={styles.timerText}>{formatTime(time)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'SpicyRice-Regular',
    marginLeft: 5,
  },
  icon: {
    color: 'white',
    marginRight: 5,
  },
});

export default Timer;
