// src/MusicPlayer.js

import Sound from 'react-native-sound';

class MusicPlayer {
  constructor() {
    if (!MusicPlayer.instance) {
      Sound.setCategory('Playback');

      this.music = new Sound(require('./assets/sounds/music-game.mp3'), (error) => {
        if (error) {
          console.log('Erro ao carregar a música:', error);
          return;
        }
        this.music.setNumberOfLoops(-1); // Loop infinito
        this.music.setVolume(1); // Volume inicial
        this.music.play((success) => {
          if (!success) {
            console.log('A música não pôde ser reproduzida');
          }
        });
      });

      MusicPlayer.instance = this;
    }

    return MusicPlayer.instance;
  }

  pause() {
    if (this.music && this.music.isPlaying()) {
      this.music.pause();
    }
  }

  play() {
    if (this.music) {
      this.music.play((success) => {
        if (!success) {
          console.log('A música não pôde ser reproduzida');
        }
      });
    }
  }

  setVolume(volume) {
    if (this.music) {
      this.music.setVolume(volume);
    }
  }

  stop() {
    if (this.music) {
      this.music.stop(() => {
        console.log('Música parada');
      });
    }
  }

  release() {
    if (this.music) {
      this.music.release();
      MusicPlayer.instance = null;
    }
  }
}

const instance = new MusicPlayer();
Object.freeze(instance);

export default instance;
