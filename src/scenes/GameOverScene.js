import Phaser from 'phaser';
import { createBackground, label, button, colors } from './shared.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  create({ score = 0, best = 0, level = 1 }) {
    createBackground(this);
    label(this, 500, 101, 'TRANSMISION FINALIZADA', 12, '#b998ff').setLetterSpacing(3);
    label(this, 500, 177, 'GAME OVER', 58).setLetterSpacing(5);
    label(this, 500, 235, 'CADA FINAL ES UN NUEVO DESPEGUE.', 12, colors.muted);
    label(this, 500, 291, String(score).padStart(6, '0'), 42, colors.cyan);
    label(this, 500, 333, `PUNTOS  /  NIVEL ${level}  /  RECORD ${String(best).padStart(6, '0')}`, 12, colors.muted);
    button(this, 405, 'VOLVER A INTENTAR  →', () => this.scene.start('GameScene'));
    const menu = label(this, 500, 462, 'VOLVER AL MENU', 12, colors.muted).setInteractive({ useHandCursor: true });
    menu.on('pointerdown', () => this.scene.start('MenuScene'));
    label(this, 500, 514, 'ENTER PARA REINICIAR', 10, colors.muted);
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('GameScene'));
  }
}
