import Phaser from 'phaser';
import { createBackground, label, readBestScore, saveBestScore, colors } from './shared.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    this.score = 0;
    this.comboKills = 0;
    this.comboUntil = 0;
    this.multiplier = 1;
    this.novaEnergy = 0;
    this.boss = null;
    this.bossNumber = 0;
    this.nextBossScore = 2000;
    this.nextBossShot = 0;
    this.lives = 3;
    this.level = 1;
    this.elapsed = 0;
    this.effects = { triple: 0, shield: 0, rapid: 0 };
    this.lastShot = -200;
    this.invulnerableUntil = 0;
    this.isPaused = false;
    this.isEnding = false;
    this.slowUntil = 0;
    this.physics.world.timeScale = 1;
    createBackground(this);
    this.player = this.physics.add.image(500, 492, 'player').setCollideWorldBounds(true);
    this.player.body.setSize(26, 30);
    this.physics.world.setBounds(20, 72, 960, 498);
    this.flame = this.add.triangle(500, 523, 0, 0, 12, 0, 6, 28, 0x64e7ff).setAlpha(0.8);
    this.bullets = this.physics.add.group({ defaultKey: 'bullet', maxSize: 40 });
    this.enemies = this.physics.add.group({ defaultKey: 'enemy' });
    this.powerUps = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.physics.add.overlap(this.player, this.enemyBullets, (_player, bullet) => {
      if (this.isEnding) return;
      bullet.destroy();
      if (this.time.now >= this.invulnerableUntil) this.takeDamage();
    });
    this.shield = this.add.circle(500, 492, 34).setStrokeStyle(2, 0x72edff).setVisible(false);
    this.physics.add.overlap(this.player, this.powerUps, (_player, item) => {
      if (this.isEnding) return;
      const type = item.getData('type');
      if (type === 'life') this.lives = Math.min(3, this.lives + 1);
      else this.effects[type] = this.elapsed + 8000;
      item.destroy();
      this.refreshHud();
    });
    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      if (!bullet.active || !enemy.active || this.isEnding) return;
      bullet.destroy();
      this.hitEnemy(enemy);
    });
    this.physics.add.overlap(this.player, this.enemies, (_player, enemy) => {
      if (this.time.now < this.invulnerableUntil || this.elapsed < this.effects.shield || this.isEnding) return;
      this.explode(enemy.x, enemy.y, 0xff83bb);
      if (!enemy.getData('boss')) enemy.destroy();
      this.takeDamage();
    });
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,P,Q,ENTER');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addCapture(['SPACE', 'UP', 'DOWN', 'LEFT', 'RIGHT']);
    this.input.keyboard.on('keydown-P', (event) => { if (!event.repeat) this.togglePause(); });
    this.game.events.on('blur', this.pauseOnBlur, this);
    this.events.once('shutdown', () => {
      this.game.events.off('blur', this.pauseOnBlur, this);
      // Phaser destruye el mundo fisico antes de ejecutar este listener.
    });
    this.spawnTimer = this.time.addEvent({ delay: 950, callback: this.spawnEnemy, callbackScope: this, loop: true });
    this.add.rectangle(500, 29, 1000, 58, 0x080e20, 0.88);
    this.scoreText = label(this, 90, 28, '', 17, colors.cyan);
    this.bestText = label(this, 350, 28, `RECORD ${String(readBestScore()).padStart(6, '0')}`, 12, colors.muted);
    this.levelText = label(this, 625, 28, '', 12, colors.muted);
    this.livesText = label(this, 859, 28, '', 17, '#b8a0ff');
    this.bossText = label(this, 650, 68, '', 12, '#b998ff');
    this.bossBar = this.add.rectangle(450, 82, 0, 5, 0xb998ff).setOrigin(0, 0.5);
    this.novaText = label(this, 145, 68, '', 12, colors.cyan);
    this.novaBar = this.add.rectangle(25, 82, 0, 5, 0x72edff).setOrigin(0, 0.5);
    this.comboText = label(this, 870, 68, '', 12, colors.cyan);
    this.effectText = label(this, 500, 560, '', 12, colors.cyan);
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
    this.comboText.setText(`COMBO ${this.comboKills} / x${this.multiplier}`);
    this.novaText.setText(`Q: NOVA BLAST ${this.novaEnergy}%`);
    this.novaBar.width = this.novaEnergy * 2.4;
    this.scoreText.setText(String(this.score).padStart(6, '0'));
    this.levelText.setText(`NIVEL ${String(this.level).padStart(2, '0')}  /  P: PAUSA`);
    this.livesText.setText(`${'♥ '.repeat(this.lives)}${'♡ '.repeat(3 - this.lives)}`);
  }

  hitEnemy(enemy, damage = 1) {
    if (!enemy.active) return;
    if (enemy.getData('boss')) {
      this.flashAt(enemy.x, enemy.y, 0xff83bb, 16);
      const health = enemy.getData('health') - damage;
      enemy.setData('health', health);
      this.bossBar.width = 400 * Math.max(0, health) / enemy.getData('maxHealth');
      if (health > 0) return;
    }
    this.destroyEnemy(enemy);
  }

  spawnBoss() {
    this.bossNumber += 1;
    this.nextBossScore += 2000;
    this.boss = this.enemies.create(500, 120, 'enemy').setScale(2.5);
    const health = 25 + this.bossNumber * 10;
    this.boss.setData({ boss: true, health, maxHealth: health });
    this.boss.body.setSize(36, 30);
    this.bossText.setText(`JEFE ${this.bossNumber}`);
    this.bossBar.width = 400;
    this.nextBossShot = this.elapsed + 1000;
  }

  updateBoss() {
    if (!this.boss && this.score >= this.nextBossScore) this.spawnBoss();
    if (!this.boss) return;
    this.boss.x = 500 + Math.sin(this.elapsed / 950) * 330;
    if (this.elapsed < this.nextBossShot) return;
    this.nextBossShot = this.elapsed + Math.max(400, 1300 - this.bossNumber * 100);
    const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y);
    const spread = this.bossNumber % 2 ? [-0.35, 0, 0.35] : [-0.6, -0.3, 0, 0.3, 0.6];
    for (const offset of spread) {
      const bullet = this.enemyBullets.create(this.boss.x, this.boss.y + 30, 'spark').setScale(2).setTint(0xff83bb);
      this.physics.velocityFromRotation(angle + offset, 170 + this.bossNumber * 12, bullet.body.velocity);
    }
  }

  destroyEnemy(enemy) {
    this.explode(enemy.x, enemy.y, 0xbe83ff);
    if (Math.random() < 0.22) {
      const type = Phaser.Utils.Array.GetRandom(['triple', 'shield', 'rapid', 'life']);
      const item = this.powerUps.create(enemy.x, enemy.y, 'spark').setScale(4).setTint({ triple: 0xb998ff, shield: 0x72edff, rapid: 0xffd166, life: 0x78ffae }[type]);
      item.setData('type', type).setVelocityY(95);
      const caption = label(this, item.x, item.y, { triple: 'T', shield: 'E', rapid: 'R', life: '+' }[type], 13);
      item.setData('caption', caption);
      item.once('destroy', () => caption.destroy());
    }
    const isBoss = enemy.getData('boss');
    if (isBoss) {
      this.slowUntil = this.elapsed + 650;
      this.cameras.main.flash(180, 80, 30, 130);
      this.cameras.main.shake(220, 0.004);
      this.boss = null;
      this.bossText.setText('');
      this.bossBar.width = 0;
    }
    enemy.destroy();
    this.comboKills += 1;
    this.comboUntil = this.elapsed + 3500;
    this.multiplier = Math.min(5, 1 + Math.floor(this.comboKills / 5));
    this.score += (isBoss ? 1000 : 100) * this.multiplier;
    this.novaEnergy = Math.min(100, this.novaEnergy + 10);
    this.refreshHud();
  }

  activateNova() {
    if (this.novaEnergy < 100) return;
    this.novaEnergy = 0;
    const wave = this.add.circle(this.player.x, this.player.y, 1).setStrokeStyle(4, 0x72edff);
    this.tweens.add({ targets: wave, radius: 260, alpha: 0, duration: 450, onComplete: () => wave.destroy() });
    if (this.enemyBullets) this.enemyBullets.clear(true, true);
    for (const enemy of [...this.enemies.getChildren()]) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) <= 260) this.hitEnemy(enemy, 15);
    }
    this.refreshHud();
  }

  spawnEnemy() {
    if (this.isPaused || this.isEnding) return;
    const enemy = this.enemies.create(Phaser.Math.Between(45, 955), -30, 'enemy');
    enemy.setVelocity(Phaser.Math.Between(-20, 20), 95 + this.level * 17);
    enemy.body.setSize(32, 28);
  }

  flashAt(x, y, tint, radius = 9) {
    const flash = this.add.circle(x, y, radius, tint, 0.9);
    this.tweens.add({ targets: flash, alpha: 0, scale: 2, duration: 100, onComplete: () => flash.destroy() });
  }

  explode(x, y, tint) {
    this.flashAt(x, y, tint, 18);
    const particles = this.add.particles(x, y, 'spark', {
      speed: { min: 35, max: 170 }, lifespan: 430,
      scale: { start: 0.9, end: 0 }, alpha: { start: 1, end: 0 },
      tint, emitting: false,
    });
    particles.explode(15);
    this.time.delayedCall(500, () => particles.destroy());
  }

  takeDamage(ignoreShield = false) {
    if (this.isEnding) return;
    if (!ignoreShield && this.elapsed < this.effects.shield) return;
    this.comboKills = 0;
    this.multiplier = 1;
    this.comboUntil = 0;
    this.lives -= 1;
    this.refreshHud();
    this.cameras.main.shake(130, 0.006);
    if (this.lives <= 0) {
      this.isEnding = true;
      this.slowUntil = 0;
      this.physics.world.timeScale = 1;
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
      this.lastShot += this.time.now - this.pausedAt;
      this.physics.resume();
    }
  }

  update(_time, delta) {
    if (this.isPaused || this.isEnding) return;
    this.physics.world.timeScale = this.elapsed < this.slowUntil ? 2.5 : 1;
    delta *= this.elapsed < this.slowUntil ? 0.4 : 1;
    this.elapsed += delta;
    if (this.comboKills && this.elapsed >= this.comboUntil) {
      this.comboKills = 0;
      this.multiplier = 1;
      this.refreshHud();
    }
    this.updateBoss();
    for (const bullet of [...this.enemyBullets.getChildren()]) {
      if (bullet.y > 610 || bullet.y < -40 || bullet.x < -40 || bullet.x > 1040) bullet.destroy();
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.Q)) this.activateNova();
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
    if (this.keys.SPACE.isDown && this.time.now - this.lastShot >= (this.elapsed < this.effects.rapid ? 90 : 180)) {
      const directions = this.elapsed < this.effects.triple ? [-160, 0, 160] : [0];
      for (const velocityX of directions) {
        const bullet = this.bullets.get(this.player.x, this.player.y - 28);
        if (bullet) {
          bullet.setActive(true).setVisible(true).setVelocity(velocityX, -590);
          bullet.body.setSize(5, 20);
        }
      }
      this.flashAt(this.player.x, this.player.y - 28, 0xc9ffff);
      this.lastShot = this.time.now;
    }
    this.shield.setPosition(this.player.x, this.player.y).setVisible(this.elapsed < this.effects.shield);
    this.effectText.setText(Object.entries(this.effects).filter(([, end]) => end > this.elapsed).map(([type, end]) => `${{ triple: 'TRIPLE', shield: 'ESCUDO', rapid: 'RAPIDO' }[type]} ${Math.ceil((end - this.elapsed) / 1000)}s`).join('   '));
    for (const item of [...this.powerUps.getChildren()]) {
      item.getData('caption').setPosition(item.x, item.y);
      if (item.y > 610) item.destroy();
    }
    for (const bullet of [...this.bullets.getChildren()]) {
      if (bullet.y < -30 || bullet.x < -30 || bullet.x > 1030) bullet.destroy();
    }
    for (const enemy of [...this.enemies.getChildren()]) {
      if (enemy.getData('boss')) continue;
      if (enemy.x < 25 || enemy.x > 975) enemy.body.velocity.x *= -1;
      if (enemy.y > 610) {
        enemy.destroy();
        this.takeDamage(true);
        if (this.isEnding) break;
      }
    }
  }
}
