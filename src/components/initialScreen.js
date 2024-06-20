import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Modal, Portal, Card, Title, Paragraph } from 'react-native-paper';
import LevelSelection from '../../screens/levelSelection';

const InitialScreen = ({ navigation }) => {
  const [showLevelSelection, setShowLevelSelection] = useState(false);

  const onLevelSelected = useCallback((level) => {
    setShowLevelSelection(false);
    navigation.navigate('Game', { difficultLevel: level });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.containerGameName}>
        <Text style={styles.title}>MegaMine Adventure</Text>
        <Text style={styles.subtitle}>Campo Minado</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Bem-vindo!</Title>
          <Paragraph style={styles.cardText}>
            Explore um emocionante jogo de campo minado com vários níveis de dificuldade.
            Escolha o seu desafio e mergulhe nessa aventura!
          </Paragraph>
          <Button mode="contained" style={styles.playButton} onPress={() => setShowLevelSelection(true)}>
            Jogar
          </Button>
          <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('Home')}>
            Loja
          </Button>
          <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('Home')}>
            Configurações
          </Button>
          <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('Home')}>
            Sair
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Modal visible={showLevelSelection} onDismiss={() => setShowLevelSelection(false)}>
          <LevelSelection 
            isVisible={showLevelSelection} 
            onLevelSelected={onLevelSelected} 
            onCancel={() => setShowLevelSelection(false)} 
          />
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', // Cor de fundo
    paddingVertical: 20,
  },
  containerGameName: {
    marginBottom: 30,
  },
  title: {
    fontSize: 50,
    fontFamily: 'Jaini-Regular',
    color: '#ffda79', // Cor do título
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 30,
    fontFamily: 'Jaini-Regular',
    color: '#ffda79', // Cor do subtítulo
    textAlign: 'center',
  },
  card: {
    width: '80%',
    backgroundColor: '#3d3d3d', // Cor do card
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffda79', // Cor do título do card
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#ffda79', // Cor do texto do card
    textAlign: 'center',
    marginBottom: 10,
  },
  playButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#20bf6b', // Cor do botão Jogar
  },
  button: {
    width: '100%',
    marginTop: 10,
    borderColor: '#ffda79', // Cor da borda dos botões
  },
});

export default React.memo(InitialScreen);
