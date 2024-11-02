// src/components/RankingPromotionDialog.js

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const RankingPromotionDialog = ({
  visible,
  onContinue,
  onGoHome,
  previousRanking,
  newRanking,
  victoriesNeeded,
}) => {

  // Obter as dimensões da tela
  const { width, height } = Dimensions.get('window');

  // Função para determinar a cor do ranking
  const getRankingColor = (ranking) => {
    switch (ranking) {
      case 'Iniciante':
        return 'green';
      case 'Amador':
        return 'orange';
      case 'Especialista':
        return 'red';
      case 'Rei do Campo Minado':
        return 'gold';
      default:
        return 'white';
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} dismissable={false} style={styles.dialogContainer}>
        <LinearGradient colors={['#222', 'black']} style={[styles.dialogContainer2, { width: width * 0.9 }]}>
          <Dialog.Content style={[styles.dialogContent, { width: width * 0.85 }]}>
            <Text style={styles.text}>
              Você alcançou {victoriesNeeded} de {victoriesNeeded} vitórias para subir de ranking. Parabéns!
            </Text>
            <Text style={styles.text}>
              Você foi promovido do ranking{' '}
              <Text style={[styles.text, { color: getRankingColor(previousRanking) }]}>
                {previousRanking}
              </Text>.
            </Text>
            <Text style={styles.text}>
              Seu novo ranking agora é{' '}
              <Text style={[styles.text, { color: getRankingColor(newRanking) }]}>
                {newRanking}
              </Text>.
            </Text>

            <TouchableOpacity onPress={onContinue} style={styles.button1}>
              <LinearGradient colors={['#4cd137', '#009432']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Continuar Jogando</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={onGoHome} style={styles.button2}>
              <LinearGradient colors={['#eb4d4b', 'red']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Menu Principal</Text>
              </LinearGradient>
            </TouchableOpacity>

          </Dialog.Content>
        </LinearGradient>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialogContainer: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    alignSelf: 'center',
    alignItems: 'center',
  },
  dialogContainer2: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  text: {
    fontSize: 20, 
    color: 'white',
    textAlign: 'center',
    paddingVertical: 5,
    fontFamily: 'SpicyRice-Regular',
  },
  button1: {
    width: '80%',
    borderRadius: 10,
    marginTop: 40,
  },
  button2: {
    width: '80%',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'SpicyRice-Regular',
    fontSize: 18,
    color: 'white',
  },
});

export default RankingPromotionDialog;
