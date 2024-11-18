import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createMinedBoard,
  calculateNearMines,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  getMineCount,
  getColumsAmount,
  getRowsAmount,
  getLevelFromRanking,
  findSafePosition,
} from '../functions';

// Função para mapear nível numérico para chave de string
const getLevelKey = (level) => {
  const levelKey =
    level === 0.1 ? 'easy' : level === 0.2 ? 'medium' : level === 0.3 ? 'hard' : 'unknown';
  return levelKey;
};

// estado inicial do jogo
const initialState = {
  board: [],
  won: false,
  lost: false,
  gameStarted: false,
  gameOverVisible: false,
  isWin: false,
  level: 0.1,
  mode: 'competitivo',
  ranking: 'Iniciante', // O Jogador, no modo competitivo, sempre começa no ranking iniciante 
  victoriesCount: 0, // contador de vitórias dos rankings
  countdownTime: null, // Tempo restante em segundos (usado apenas nos rankings com timer)

  // Recordes de tempo de modo casual
  bestTimes: {
    easy: null,
    medium: null,
    hard: null,
  },

  score: 0, // Pontuação do jogador no ranking "Rei do Campo Minado"
  promotionVisible: false, // Controla a exibição da tela de promoção
  previousRanking: null, // Armazena o ranking anterior para exibir na promoção

  // Configurações do áudio
  isButtonSoundMuted: false, // Estado para mutar som dos botões
  isMusicMuted: false, // Estado para mutar a música do jogo
  musicVolume: 1, // Volume da música (1 = volume máximo)
};

// Gerenciamento de operações do jogo
const gameReducer = (state, action) => {
  // Escolha dos modos de jogo
  switch (action.type) {
    case 'SET_MODE':
      console.log(`Modo definido para ${action.mode}`);
      return { ...state, mode: action.mode };

  // Escolha da dificuldade
    case 'SET_LEVEL':
      console.log(`Nível definido para ${action.level}`);
      return { ...state, level: action.level };

  // Atualização do melhor tempo de uma determinada dificuldade
    case 'SET_BEST_TIME':
      return {
        ...state,
        bestTimes: {
          ...state.bestTimes,
          [action.level]: action.time,
        },
      };

      case 'NEW_GAME': {
        // Determinar o nível baseado no modo de jogo
        const level = state.mode === 'competitivo' ? getLevelFromRanking(state.ranking) : state.level;
      
        // Obter dimensões do tabuleiro e quantidade de minas
        const cols = getColumsAmount(level);
        const rows = getRowsAmount(level);
        const mines = getMineCount(level);
      
        // Criar o tabuleiro e espalhar as minas
        let newBoard = createMinedBoard(rows, cols, mines);
      
        // Calcular minas próximas para todos os campos
        calculateNearMines(newBoard);
      
        // Garantir que o primeiro clique seja em uma posição segura
        let safePosition = findSafePosition(newBoard);
        let attempts = 0;
        while (
          (newBoard[safePosition.row][safePosition.column].mined ||
            newBoard[safePosition.row][safePosition.column].nearMines !== 0) &&
          attempts < 1000
        ) {
          safePosition = findSafePosition(newBoard);
          attempts++;
        }
      
        // Caso não encontre uma posição segura, buscar manualmente a primeira posição válida
        if (
          newBoard[safePosition.row][safePosition.column].mined ||
          newBoard[safePosition.row][safePosition.column].nearMines !== 0
        ) {
          outerLoop: for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (!newBoard[r][c].mined && newBoard[r][c].nearMines === 0) {
                safePosition = { row: r, column: c };
                break outerLoop;
              }
            }
          }
        }
        console.log(
          `Posição segura encontrada em (${safePosition.row}, ${safePosition.column}) depois de ${attempts} tentativas`
        );
      
        // Abrir o campo inicial em posição segura
        const initialDepth = 1; // Profundidade inicial
        openField(newBoard, safePosition.row, safePosition.column, initialDepth);
      
        // Configurar o tempo de contagem regressiva para os ultimos rankings 
        let countdownTime = null;
        if (state.mode === 'competitivo') {
          if (state.ranking === 'Especialista') {
            countdownTime = 210; 
          } else if (state.ranking === 'Rei do Campo Minado') {
            countdownTime = 180;
          }
        }
        return {
          ...state,
          board: newBoard,
          won: false,
          lost: false,
          gameStarted: true,
          gameOverVisible: false,
          isWin: false,
          countdownTime: countdownTime,
          level,
        };
      }

    case 'OPEN_FIELD':
      if (state.lost || state.won) return state;

      const newBoardOpen = cloneBoard(state.board);
      openField(newBoardOpen, action.row, action.column);

      const lost = hadExplosion(newBoardOpen);
      const won = wonGame(newBoardOpen);

      if (lost) {
        showMines(newBoardOpen);
      }

      console.log(
        `Campo aberto em (${action.row}, ${action.column}) - Jogo ${
          lost ? 'perdido' : won ? 'vencido' : 'em andamento'
        }`
      );

      let newVictoriesCount = state.victoriesCount;
      let newRanking = state.ranking;
      let newLevel = state.level;
      let newCountdownTime = state.countdownTime;
      let newScore = state.score;
      let promotionOccurred = false;
      let previousRanking = state.previousRanking;

      if (won && state.mode === 'competitivo') {
        if (newRanking === 'Rei do Campo Minado') {
          // Sistema de pontuação no ranking "Rei do Campo Minado"
          newScore += 3;
        } else {
          newVictoriesCount += 1;

          let victoriesNeeded = 0;
          if (newRanking === 'Iniciante') {
            victoriesNeeded = 1;
          } else if (newRanking === 'Amador') {
            victoriesNeeded = 1;
          } else if (newRanking === 'Especialista') {
            victoriesNeeded = 1;
          }

          if (newVictoriesCount >= victoriesNeeded) {
            promotionOccurred = true;
            previousRanking = newRanking;

            if (newRanking === 'Iniciante') {
              newRanking = 'Amador';
              newLevel = 0.2;
              newCountdownTime = null;
            } else if (newRanking === 'Amador') {
              newRanking = 'Especialista';
              newLevel = 0.3;
              newCountdownTime = 210; // 3 minutos e 30 segundos
            } else if (newRanking === 'Especialista') {
              newRanking = 'Rei do Campo Minado';
              newLevel = 0.3;
              newCountdownTime = 180; // 3 minutos
              newScore = 0; // Iniciar pontuação
            }
            newVictoriesCount = 0;
          }
        }
      }

      if (lost && state.mode === 'competitivo') {
        if (newRanking === 'Especialista') {
          // Resetar o timer no ranking "Especialista"
          newCountdownTime = 210;
        } else if (newRanking === 'Rei do Campo Minado') {
          // Subtrair 1 ponto no ranking "Rei do Campo Minado", mínimo zero
          newScore = Math.max(0, newScore - 1);
        }
      }

      return {
        ...state,
        board: newBoardOpen,
        lost,
        won,
        gameStarted: true,
        gameOverVisible: lost || won,
        isWin: won,
        victoriesCount: newVictoriesCount,
        ranking: newRanking,
        level: newLevel,
        countdownTime: newCountdownTime,
        score: newScore,
        promotionVisible: promotionOccurred || state.promotionVisible,
        previousRanking: promotionOccurred ? previousRanking : state.previousRanking,
      };

    case 'SELECT_FIELD':
      if (state.lost || state.won) return state;

      const newBoardSelect = cloneBoard(state.board);
      invertFlag(newBoardSelect, action.row, action.column);

      // Verificar se o jogo foi vencido após marcar/desmarcar a bandeira
      const wonAfterFlag = wonGame(newBoardSelect);

      let newVictoriesCountSelect = state.victoriesCount;
      let newRankingSelect = state.ranking;
      let newLevelSelect = state.level;
      let newCountdownTimeSelect = state.countdownTime;
      let newScoreSelect = state.score;
      let promotionOccurredSelect = false;
      let previousRankingSelect = state.previousRanking;

      if (wonAfterFlag && state.mode === 'competitivo') {
        if (newRankingSelect === 'Rei do Campo Minado') {
          // Sistema de pontuação no ranking "Rei do Campo Minado"
          newScoreSelect += 3;
        } else {
          newVictoriesCountSelect += 1;

          let victoriesNeeded = 0;
          if (newRankingSelect === 'Iniciante') {
            victoriesNeeded = 1;
          } else if (newRankingSelect === 'Amador') {
            victoriesNeeded = 1;
          } else if (newRankingSelect === 'Especialista') {
            victoriesNeeded = 1;
          }

          if (newVictoriesCountSelect >= victoriesNeeded) {
            promotionOccurredSelect = true;
            previousRankingSelect = newRankingSelect;

            if (newRankingSelect === 'Iniciante') {
              newRankingSelect = 'Amador';
              newLevelSelect = 0.2;
              newCountdownTimeSelect = null;
            } else if (newRankingSelect === 'Amador') {
              newRankingSelect = 'Especialista';
              newLevelSelect = 0.3;
              newCountdownTimeSelect = 210; // 3 minutos e 30 segundos
            } else if (newRankingSelect === 'Especialista') {
              newRankingSelect = 'Rei do Campo Minado';
              newLevelSelect = 0.3;
              newCountdownTimeSelect = 180; // 3 minutos
              newScoreSelect = 0; // Iniciar pontuação
            }
            newVictoriesCountSelect = 0;
          }
        }
      }

      if (wonAfterFlag && state.mode === 'casual') {
        // Lógica para o modo casual se necessário
      }

      return {
        ...state,
        board: newBoardSelect,
        won: wonAfterFlag,
        gameOverVisible: wonAfterFlag || state.gameOverVisible,
        isWin: wonAfterFlag || state.isWin,
        victoriesCount: newVictoriesCountSelect,
        ranking: newRankingSelect,
        level: newLevelSelect,
        countdownTime: newCountdownTimeSelect,
        score: newScoreSelect,
        promotionVisible: promotionOccurredSelect || state.promotionVisible,
        previousRanking: promotionOccurredSelect ? previousRankingSelect : state.previousRanking,
      };

      // perda por tempo
    case 'GAME_OVER_TIME_UP':
      console.log(`O tempo acabou. Ranking: ${state.ranking}`);
      // atualização da pontuação em caso de perda por tempo 
      let updatedScore = state.score;
      if (state.ranking === 'Rei do Campo Minado') {
        // Subtrair 1 ponto no ranking "Rei do Campo Minado", o mínimo é zero
        updatedScore = Math.max(0, updatedScore - 1); 
      }

      return {
        ...state,
        lost: true,
        gameOverVisible: true,
        isWin: false,
        countdownTime:
          state.ranking === 'Especialista'
            ? 210
            : state.ranking === 'Rei do Campo Minado'
            ? 180
            : null,
        score: updatedScore,
      };

      // perda por sair do jogo em andamento 
    case 'LOSE_POINT_FOR_EXIT':
      const updatedScoreForExit = Math.max(0, state.score - 1);
      console.log(`Pontuação ajustada para ${updatedScoreForExit}`);
      return {
        ...state,
        score: updatedScoreForExit,
      };

    case 'TOGGLE_GAME_OVER':
      return { ...state, gameOverVisible: !state.gameOverVisible };

    case 'HIDE_PROMOTION':
      return {
        ...state,
        promotionVisible: false,
        previousRanking: null,
      };

    case 'TOGGLE_BUTTON_SOUND':
      console.log(
        `Som dos botões ${
          state.isButtonSoundMuted ? 'ativado' : 'desativado'
        }`
      );
      return { ...state, isButtonSoundMuted: !state.isButtonSoundMuted };

    case 'TOGGLE_MUSIC':
      console.log(`Música ${state.isMusicMuted ? 'ativada' : 'desativada'}`);
      return { ...state, isMusicMuted: !state.isMusicMuted };
 
    case 'SET_MUSIC_VOLUME':
      console.log(`Volume da música ajustado para ${action.volume}`);
      return { ...state, musicVolume: action.volume };

    case 'LOAD_GAME_STATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      console.log(`${action.type}`);
      return state;
  }
};

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // executa sempre que o estado de ranking ou de score muda, salvando o novo estado (modo competitivo)
  const saveGameState = async (gameState) => {
    try {
      const jsonState = JSON.stringify(gameState);
      await AsyncStorage.setItem('gameState', jsonState);
    } catch (error) {
      console.error('Erro para salvar o esatdo do jogo:', error);
    }
  };

  // Função para carregar o estado do jogo (modo competitivo)
  const loadGameState = async () => {
    try {
      const jsonState = await AsyncStorage.getItem('gameState');
      if (jsonState !== null) {
        const gameState = JSON.parse(jsonState);
        dispatch({ type: 'LOAD_GAME_STATE', payload: gameState });
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  };

  // Carregar o estado do jogo quando o componente monta 
  useEffect(() => {
    loadGameState();
  }, []);

  // Salvar o estado do jogo sempre que ele mudar (modo competitivo)
  useEffect(() => {
    const { ranking, victoriesCount, score, level, previousRanking } = state;
    const gameStateToSave = { ranking, victoriesCount, score, level, previousRanking };
    saveGameState(gameStateToSave);
  }, [state.ranking, state.victoriesCount, state.score, state.level, state.previousRanking]);

  // Função para salvar o melhor tempo (modo casual)
  const saveBestTime = async (level, time) => {
    try {
      if (time <= 0) { // garantindo que não será salvo tempo = 0 
        console.warn('Tempo inválido, não será salvo:', time);
        return;
      }

      const levelKey = getLevelKey(level); // pegando os níveis 0.1, 0.2, 0.3 em string
      const key = `bestTime_${levelKey}`; // armazenando em key - "bestTime_easy"
      const existingTime = await AsyncStorage.getItem(key); // obtendo o tempo atual salvo no AsyncStorage

      if (!existingTime || time < parseFloat(existingTime)) { // se o existingTime for null ou 
        await AsyncStorage.setItem(key, time.toString());     // o timer atual for menor que o salvo
        dispatch({ type: 'SET_BEST_TIME', level: levelKey, time }); // AsyncStorage o salva como melhor tempo em formato
        console.log('Atualização melhor tempo:', levelKey, time);          // de string
      } else {
        console.log('Melhor tempo não atualizado:', levelKey, time, 'Tempo atual:', existingTime);
      }
    } catch (error) {
      console.error('Erro ao salvar o melhor tempo:', error);
    }
  };

  // Função para carregar o melhor tempo
  const loadBestTime = async (level) => { // atualiza o estado global do jogo com o melhor tempo carregado 
    try {
      const levelKey = getLevelKey(level);
      const key = `bestTime_${levelKey}`;
      const time = await AsyncStorage.getItem(key);
      const formattedTime = time ? parseFloat(time) : null; // passa o tempo de string para número 
      dispatch({ type: 'SET_BEST_TIME', level: levelKey, time: formattedTime }); // dispara a ação "Set_BEST_TIME" para atualizar o eatado global
      return formattedTime; // retorna o tempo formatado 
    } catch (error) {
      console.error('Erro ao carregar o melhor tempo:', error);
      return null;
    }
  };

  return (
    <GameContext.Provider value={{ state, dispatch, saveBestTime, loadBestTime }}>
      {children}
    </GameContext.Provider>
  );
};
