import Phaser from 'phaser';
import { createBackground, createTextures, label, button, readBestScore, colors } from './shared.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    createTextures(this);
    createBackground(this);
    label(this, 500, 72, '✦  COMANDO DE VUELO / 001', 12, colors.cyan);
    const ship = this.add.image(500, 171, 'player').setScale(1.65);
    this.tweens.add({ targets: ship, y: 162, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    label(this, 500, 257, 'RUVANOVA', 66).setLetterSpacing(9);
    label(this, 500, 313, 'TU ULTIMA FRONTERA ES SOBREVIVIR', 12, colors.muted).setLetterSpacing(2);
    button(this, 387, 'INICIAR MISION  →', () => this.scene.start('GameScene'));
    label(this, 500, 435, 'PRESIONA ENTER PARA DESPEGAR', 10, colors.muted);
    label(this, 500, 509, `MEJOR PUNTUACION  /  ${String(readBestScore()).padStart(6, '0')}`, 12, colors.cyan);
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('GameScene'));
  }
}
