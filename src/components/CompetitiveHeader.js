// src/components/CompetitiveHeader.js

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, Portal, Dialog } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Flag from './Flag';
import Timer from './Timer';
import LinearGradient from 'react-native-linear-gradient';

const CompetitiveHeader = ({
  flagsLeft,
  onNewGame,
  onExit,
  onFlagPress,
  timerRef,
  countdown,
  onCountdownFinish,
  ranking,
  victoriesCount,
  score, // Receber a pontuação atual
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => {
    if (timerRef.current && (ranking === 'Especialista' || ranking === 'Rei do Campo Minado')) {
      timerRef.current.stop();
    }
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    if (timerRef.current && (ranking === 'Especialista' || ranking === 'Rei do Campo Minado')) {
      timerRef.current.start();
    }
  };

  const handleNewGame = () => {
    setMenuVisible(false);
    onNewGame();
  };

  return (
    <LinearGradient colors={['#72a34d', '#527a33']}>
      <View style={styles.container}>
        <View style={styles.flagContainer}>
          <TouchableOpacity style={styles.flagButton} onPress={onFlagPress}>
            <Flag bigger={true} />
          </TouchableOpacity>
          <Text style={styles.flagsLeft}>= {flagsLeft}</Text>
        </View>

        <View style={styles.timerAndRankingContainer}>
          {/* Renderizar o Timer apenas se o ranking for 'Especialista' ou 'Rei do Campo Minado' */}
          {(ranking === 'Especialista' || ranking === 'Rei do Campo Minado') && (
            <View style={styles.timerContainer}>
              <Timer
                ref={timerRef}
                style={styles.timer}
                countdown={countdown}
                onCountdownFinish={onCountdownFinish}
              />
            </View>
          )}
          <View style={styles.rankingContainer}>
            <Text style={styles.rankingText}>Ranking: {ranking}</Text>
            {ranking === 'Rei do Campo Minado' ? (
              <Text style={styles.scoreText}>Pontuação: {score}</Text>
            ) : (
              <Text style={styles.victoriesText}>Vitórias: {victoriesCount}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={openMenu} style={styles.iconButton}>
          <Icon name="pause-circle" size={45} color="white" />
        </TouchableOpacity>

        <Portal>
          <Dialog visible={menuVisible} onDismiss={closeMenu} style={styles.dialogContainer}>
            <LinearGradient colors={['#2f3640', '#222']} style={styles.menu}>
              <Dialog.Title style={styles.containerTitle}>Pausado</Dialog.Title>
              <Dialog.Content>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleNewGame}>
                    <LinearGradient colors={['#72a34d', '#527a33']} style={styles.button}>
                      <Text style={styles.textButtonMenu}>Novo Jogo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onExit}>
                    <LinearGradient colors={['#e55039', '#b33939']} style={styles.button}>
                      <Text style={styles.textButtonMenu}>Menu principal</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button style={styles.buttonCancel} onPress={closeMenu}>
                  <Text style={styles.textButtonMenu}>Cancelar</Text>
                </Button>
              </Dialog.Actions>
            </LinearGradient>
          </Dialog>
        </Portal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagButton: {
    marginRight: 10,
  },
  flagsLeft: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFF',
  },
  timerAndRankingContainer: {
    alignItems: 'center',
  },
  timerContainer: {
    marginBottom: 5,
  },
  rankingContainer: {
    alignItems: 'center',
  },
  rankingText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  victoriesText: {
    fontSize: 14,
    color: '#FFF',
  },
  scoreText: {
    fontSize: 14,
    color: '#FFD700', // Cor dourada para destacar a pontuação
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 5,
  },
  dialogContainer: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    alignItems: 'center',
  },
  menu: {
    borderRadius: 20,
    overflow: 'hidden',
    width: 300,
  },
  containerTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
  },
  textButtonMenu: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonCancel: {
    alignSelf: 'center',
  },
});

export default CompetitiveHeader;
