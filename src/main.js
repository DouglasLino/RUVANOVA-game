import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import './style.css';

const gameElement = document.querySelector('#game');

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 1000,
  height: 580,
  backgroundColor: '#080e20',
  input: { keyboard: { target: gameElement, capture: ['SPACE', 'UP', 'DOWN', 'LEFT', 'RIGHT'] } },
  callbacks: {
    postBoot(instance) {
      instance.events.once(Phaser.Core.Events.POST_STEP, () => {
        // Las texturas ya estan dibujadas tras el primer paso del juego.
        for (const key of ['player', 'enemy']) {
          const source = instance.textures.getBase64(key);
          for (const image of document.querySelectorAll(`[data-texture="${key}"]`)) image.src = source;
        }
      });
    },
  },
  physics: { default: 'arcade', arcade: { debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [MenuScene, GameScene, GameOverScene],
});

gameElement.addEventListener('pointerdown', () => {
  gameElement.focus({ preventScroll: true });
});

gameElement.addEventListener('blur', () => {
  for (const scene of game.scene.getScenes(true)) {
    scene.input.keyboard.resetKeys();
    if (scene.scene.key === 'GameScene') scene.pauseOnBlur();
  }
});
