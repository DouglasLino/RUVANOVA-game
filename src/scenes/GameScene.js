import Phaser from 'phaser';
import { createBackground, label, readBestScore, saveBestScore, colors } from './shared.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.elapsed = 0;
    this.lastShot = -200;
    this.invulnerableUntil = 0;
    this.isPaused = false;
    this.isEnding = false;
    createBackground(this);
    this.player = this.physics.add.image(500, 492, 'player').setCollideWorldBounds(true);
    this.player.body.setSize(26, 30);
    this.physics.world.setBounds(20, 72, 960, 498);
    this.flame = this.add.triangle(500, 523, 0, 0, 12, 0, 6, 28, 0x64e7ff).setAlpha(0.8);
    this.bullets = this.physics.add.group({ defaultKey: 'bullet', maxSize: 40 });
    this.enemies = this.physics.add.group({ defaultKey: 'enemy' });
    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      if (!bullet.active || !enemy.active || this.isEnding) return;
      this.explode(enemy.x, enemy.y, 0xbe83ff);
      bullet.destroy();
      enemy.destroy();
      this.score += 100;
      this.refreshHud();
    });
    this.physics.add.overlap(this.player, this.enemies, (_player, enemy) => {
      if (this.time.now < this.invulnerableUntil || this.isEnding) return;
      this.explode(enemy.x, enemy.y, 0xff83bb);
      enemy.destroy();
      this.takeDamage();
    });
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,P,ENTER');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addCapture(['SPACE', 'UP', 'DOWN', 'LEFT', 'RIGHT']);
    this.input.keyboard.on('keydown-P', (event) => { if (!event.repeat) this.togglePause(); });
    this.game.events.on('blur', this.pauseOnBlur, this);
    this.events.once('shutdown', () => this.game.events.off('blur', this.pauseOnBlur, this));
    this.spawnTimer = this.time.addEvent({ delay: 950, callback: this.spawnEnemy, callbackScope: this, loop: true });
    this.add.rectangle(500, 29, 1000, 58, 0x080e20, 0.88);
    this.scoreText = label(this, 90, 28, '', 17, colors.cyan);
    this.bestText = label(this, 350, 28, `RECORD ${String(readBestScore()).padStart(6, '0')}`, 12, colors.muted);
    this.levelText = label(this, 625, 28, '', 12, colors.muted);
    this.livesText = label(this, 859, 28, '', 17, '#b8a0ff');
    this.refreshHud();
    this.pauseLayer = this.add.container(0, 0).setDepth(20).setVisible(false);
    this.pauseLayer.add([
      this.add.rectangle(500, 290, 1000, 580, 0x050917, 0.85),
      label(this, 500, 248, 'MISION EN PAUSA', 37),
      label(this, 500, 307, 'P PARA REANUDAR', 14, colors.cyan),
      label(this, 500, 350, 'TOMA AIRE. EL UNIVERSO PUEDE ESPERAR.', 11, colors.muted),
    ]);
  }

  refreshHud() {
    this.scoreText.setText(String(this.score).padStart(6, '0'));
    this.levelText.setText(`NIVEL ${String(this.level).padStart(2, '0')}  /  P: PAUSA`);
    this.livesText.setText(`${'♥ '.repeat(this.lives)}${'♡ '.repeat(3 - this.lives)}`);
  }

  spawnEnemy() {
    if (this.isPaused || this.isEnding) return;
    const enemy = this.enemies.create(Phaser.Math.Between(45, 955), -30, 'enemy');
    enemy.setVelocity(Phaser.Math.Between(-20, 20), 95 + this.level * 17);
    enemy.body.setSize(32, 28);
  }

  explode(x, y, tint) {
    const particles = this.add.particles(x, y, 'spark', {
      speed: { min: 35, max: 170 }, lifespan: 430,
      scale: { start: 0.9, end: 0 }, alpha: { start: 1, end: 0 },
      tint, emitting: false,
    });
    particles.explode(15);
    this.time.delayedCall(500, () => particles.destroy());
  }

  takeDamage() {
    if (this.isEnding) return;
    this.lives -= 1;
    this.refreshHud();
    this.cameras.main.shake(130, 0.006);
    if (this.lives <= 0) {
      this.isEnding = true;
      this.physics.pause();
      this.spawnTimer.paused = true;
      this.explode(this.player.x, this.player.y, 0x72edff);
      this.player.setVisible(false);
      this.flame.setVisible(false);
      const best = saveBestScore(this.score);
      this.time.delayedCall(600, () => this.scene.start('GameOverScene', { score: this.score, best, level: this.level }));
      return;
    }
    this.invulnerableUntil = this.time.now + 1600;
  }

  pauseOnBlur() {
    if (!this.isPaused && !this.isEnding) this.togglePause();
  }

  togglePause() {
    if (this.isEnding) return;
    this.isPaused = !this.isPaused;
    this.pauseLayer.setVisible(this.isPaused);
    this.spawnTimer.paused = this.isPaused;
    this.tweens.paused = this.isPaused;
    if (this.isPaused) {
      this.pausedAt = this.time.now;
      this.physics.pause();
    } else {
      this.invulnerableUntil += this.time.now - this.pausedAt;
      this.physics.resume();
    }
  }

  update(_time, delta) {
    if (this.isPaused || this.isEnding) return;
    this.elapsed += delta;
    const nextLevel = Math.floor(this.elapsed / 15000) + 1;
    if (nextLevel !== this.level) {
      this.level = nextLevel;
      this.spawnTimer.delay = Math.max(240, 950 - (this.level - 1) * 85);
      this.refreshHud();
    }
    const horizontal = Number(this.keys.D.isDown || this.cursors.right.isDown) - Number(this.keys.A.isDown || this.cursors.left.isDown);
    const vertical = Number(this.keys.S.isDown || this.cursors.down.isDown) - Number(this.keys.W.isDown || this.cursors.up.isDown);
    this.player.setVelocity(horizontal, vertical);
    this.player.body.velocity.normalize().scale(330);
    this.player.setAlpha(this.time.now < this.invulnerableUntil ? (Math.floor(this.time.now / 90) % 2 ? 0.3 : 1) : 1);
    this.flame.setPosition(this.player.x, this.player.y + 31).setScale(1, Phaser.Math.FloatBetween(0.7, 1.2)).setAlpha(this.player.alpha * 0.8);
    if (this.keys.SPACE.isDown && this.time.now - this.lastShot >= 180) {
      const bullet = this.bullets.get(this.player.x, this.player.y - 28);
      if (bullet) {
        bullet.setActive(true).setVisible(true).setVelocity(0, -590);
        bullet.body.setSize(5, 20);
        this.lastShot = this.time.now;
      }
    }
    for (const bullet of this.bullets.getChildren()) {
      if (bullet.y < -30) bullet.destroy();
    }
    for (const enemy of [...this.enemies.getChildren()]) {
      if (enemy.x < 25 || enemy.x > 975) enemy.body.velocity.x *= -1;
      if (enemy.y > 610) {
        enemy.destroy();
        this.takeDamage();
        if (this.isEnding) break;
      }
    }
  }
}
