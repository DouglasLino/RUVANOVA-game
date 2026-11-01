import Phaser from 'phaser';

export const colors = { cyan: '#72edff', muted: '#8393b1', white: '#edf5ff' };

export function label(scene, x, y, text, size = 16, color = colors.white) {
  return scene.add.text(x, y, text, { fontFamily: 'monospace', fontSize: size, color }).setOrigin(0.5);
}

export function readBestScore() {
  try {
    const value = Number(localStorage.getItem('ruvanova.bestScore'));
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score) {
  const best = Math.max(readBestScore(), score);
  try { localStorage.setItem('ruvanova.bestScore', String(best)); } catch { /* El juego funciona sin almacenamiento disponible. */ }
  return best;
}

export function createBackground(scene) {
  const glow = scene.add.graphics();
  for (let radius = 260; radius > 0; radius -= 20) {
    glow.fillStyle(0x382b81, 0.013).fillCircle(710, 260, radius);
    glow.fillStyle(0x104a70, 0.01).fillCircle(210, 440, radius);
  }
  const stars = Array.from({ length: 100 }, () => scene.add.circle(
    Phaser.Math.Between(0, 1000), Phaser.Math.Between(0, 580),
    Phaser.Math.FloatBetween(0.5, 1.5), 0xbbdcff, Phaser.Math.FloatBetween(0.15, 0.7),
  ));
  const updateStars = (_time, delta) => {
    if (scene.isPaused) return;
    for (const star of stars) {
      const speed = star.radius < 0.85 ? 0.008 : star.radius < 1.2 ? 0.022 : 0.045;
      star.y += delta * speed * (scene.elapsed < scene.slowUntil ? 0.4 : 1);
      if (star.y > 582) star.y = -2;
    }
  };
  scene.events.on('update', updateStars);
  scene.events.once('shutdown', () => scene.events.off('update', updateStars));
  const grid = scene.add.graphics().lineStyle(1, 0x426182, 0.045);
  for (let x = 0; x < 1000; x += 50) grid.lineBetween(x, 0, x, 580);
  for (let y = 0; y < 580; y += 50) grid.lineBetween(0, y, 1000, y);
}

export function createTextures(scene) {
  if (scene.textures.exists('player')) return;
  const graphic = scene.make.graphics({ x: 0, y: 0 }, false);
  graphic.fillStyle(0x2d789d).fillPoints([{x:24,y:2},{x:46,y:42},{x:24,y:33},{x:2,y:42}], true);
  graphic.fillStyle(0xc5f7ff).fillPoints([{x:24,y:0},{x:34,y:36},{x:24,y:30},{x:14,y:36}], true);
  graphic.fillStyle(0x46d9f5).fillTriangle(24, 10, 29, 27, 19, 27);
  graphic.fillStyle(0x916bff).fillRect(5, 32, 5, 9).fillRect(38, 32, 5, 9);
  graphic.generateTexture('player', 48, 46).clear();
  graphic.fillStyle(0xa15af0).fillPoints([{x:2,y:4},{x:15,y:12},{x:23,y:4},{x:31,y:12},{x:44,y:4},{x:37,y:27},{x:23,y:38},{x:9,y:27}], true);
  graphic.fillStyle(0x351d60).fillTriangle(11, 13, 35, 13, 23, 32);
  graphic.fillStyle(0xff85bd).fillRect(18, 13, 10, 7);
  graphic.generateTexture('enemy', 46, 40).clear();
  graphic.fillStyle(0x53dbff, 0.25).fillRoundedRect(0, 0, 10, 26, 5);
  graphic.fillStyle(0xc9ffff).fillRoundedRect(3, 2, 4, 21, 2);
  graphic.generateTexture('bullet', 10, 26).clear();
  graphic.fillStyle(0xffffff).fillCircle(3, 3, 3);
  graphic.generateTexture('spark', 6, 6).destroy();
}

export function button(scene, y, text, action) {
  const panel = scene.add.rectangle(500, y, 270, 51, 0x60d9f1).setStrokeStyle(1, 0xa4f4ff);
  const caption = label(scene, 500, y, text, 16, '#071725');
  panel.setInteractive({ useHandCursor: true }).on('pointerdown', action);
  panel.on('pointerover', () => panel.setFillStyle(0x9af1ff));
  panel.on('pointerout', () => panel.setFillStyle(0x60d9f1));
  return [panel, caption];
}
