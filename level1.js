
var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 650,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 170 },
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var worldWidth = 4000;
var cursors;
var grow;
var player;
var stimage;
var startText;
var bullets;
var score = 0;
var scoreText;
var life = 5;
var lifeText;
var maxAmmo = 5;
var ammo = maxAmmo;
var ammoText;
var keysCollected = 0;
var key;
var enemy;
var enemyHealth = 3;
var ammoPacks;
var portal;

function preload() {
    cursors = this.input.keyboard.createCursorKeys();

    this.load.image('gamefon', 'assets/gamefon.png');
    this.load.image('grow', 'assets/grow.png');
    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('stimage', 'assets/gamet.png');
    this.load.image('cpase', 'assets/cpase.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('key', 'assets/key.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('ammoPack', 'assets/ammo.png');
    this.load.image('portal', 'assets/portal.png'); // Додати зображення порталу
}

function create() {
    this.add.tileSprite(0, 0, worldWidth, 1080, "gamefon").setOrigin(0, 0).setScale(1).setDepth(0);

    stimage = this.add.image(200, 325, 'stimage');
    stimage = this.add.image(900, 325, 'cpase');

    startText = this.add.text(200, 390, 'Кнопки керування', { font: '32px Arial', fill: '#ffffff' }).setOrigin(0.5, 0.5);
    startText = this.add.text(900, 390, 'Постріл ', { font: '32px Arial', fill: '#ffffff' }).setOrigin(0.5, 0.5);
    startText = this.add.text(1700, 390, 'Збери 3 ключі, щоб потрапити на 2 рівень', { font: '32px Arial', fill: '#ffffff' }).setOrigin(0.5, 0.5);

    grow = this.physics.add.staticGroup();

    for (var x = 0; x < worldWidth; x += 128) {
        grow.create(x, 560, "grow").setOrigin(0, 0).refreshBody();
    }

    player = this.physics.add.sprite(100, 500, 'hero');
    player.setBounce(0.2).setDepth(Phaser.Math.Between(4, 5)).setCollideWorldBounds(true).setScale(2);
    player.body.setGravityY(300);

    this.physics.add.collider(player, grow);

    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'hero', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('hero', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    var resetButton = this.add.text(550, 70, '♻️', { fontSize: '60px', fill: '#FFF' }).setInteractive().setScrollFactor(0);
    resetButton.on('pointerdown', () => {
        console.log('restart');
        this.scene.restart();
    });

    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);
    this.cameras.main.startFollow(player, true, 0.1, 0, 0, 300);

    this.input.keyboard.on('keydown-SPACE', shootBullet, this);
    bullets = this.physics.add.group();

    scoreText = this.add.text(20, 60, 'Keys: 0', { fontSize: '20px', fill: '#FFF' }).setOrigin(0, 0).setScrollFactor(0);
    lifeText = this.add.text(20, 35, showLife(), { fontSize: '20px', fill: '#FFF' }).setOrigin(0, 0).setScrollFactor(0);
    ammoText = this.add.text(20, 85, 'Ammo: ' + ammo, { fontSize: '20px', fill: '#FFF' }).setOrigin(0, 0).setScrollFactor(0);

    key = this.physics.add.sprite(1700, 500, 'key');
    this.physics.add.collider(key, grow);
    this.physics.add.overlap(player, key, collectKey, null, this);

    key = this.physics.add.sprite(2800, 500, 'key');
    this.physics.add.collider(key, grow);
    this.physics.add.overlap(player, key, collectKey, null, this);

    enemy = this.physics.add.sprite(2500, 500, 'enemy');
    enemy.health = enemyHealth;
    this.physics.add.collider(enemy, grow);
    this.physics.add.overlap(bullets, enemy, hitEnemyWithBullet, null, this);

    ammoPacks = this.physics.add.group();
    this.physics.add.collider(ammoPacks, grow);
    this.physics.add.overlap(player, ammoPacks, collectAmmoPack, null, this);

    var ammoPackPositions = [
        { x: 840, y: 550 },
        { x: 880, y: 550 },
        { x: 930, y: 550 },
        { x: 970, y: 550 }
    ];

    for (var pos of ammoPackPositions) {
        var ammoPack = ammoPacks.create(pos.x, pos.y, 'ammoPack');
        ammoPack.body.allowGravity = false;
    }

    // Створення порталу і встановлення його невидимим на початку
    portal = this.physics.add.sprite(3500, 500, 'portal');
    portal.setVisible(false);
    this.physics.add.collider(portal, grow);
    this.physics.add.overlap(player, portal, enterPortal, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-500);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(500);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-520);
    }

    this.physics.add.overlap(player, enemy, playerEnemyOverlap, null, this);
}

function shootBullet() {
    if (ammo > 0) {
        var bullet = bullets.create(player.x, player.y, 'bullet');
        bullet.body.allowGravity = false;
        if (player.body.velocity.x < 0) {
            bullet.setVelocityX(-2000);
        } else {
            bullet.setVelocityX(2000);
        }
        ammo -= 1;
        ammoText.setText('Ammo: ' + ammo);
    }
}

function showLife() {
    var lifeLine = 'Life: ';
    for (var i = 0; i < life; i++) {
        lifeLine += '❤️';
    }
    return lifeLine;
}

function collectKey(player, key) {
    key.disableBody(true, true);
    score += 1;
    scoreText.setText('Keys: ' + score);

    // Відкрити портал після збору трьох ключів
    if (score === 3) {
        portal.setVisible(true);
    }
}

function hitEnemyWithBullet(enemy, bullet) {
    bullet.disableBody(true, true);
    enemy.health -= 1;

    if (enemy.health <= 0) {
        enemy.disableBody(true, true);
        dropKey.call(this, enemy.x, enemy.y);
    }
}

function dropKey(x, y) {
    key = this.physics.add.sprite(x, y, 'key');
    this.physics.add.collider(key, grow);
    this.physics.add.overlap(player, key, collectKey, null, this);
}

function collectAmmoPack(player, ammoPack) {
    ammoPack.disableBody(true, true);
    ammo = Math.min(ammo + 1, maxAmmo);
    ammoText.setText('Ammo: ' + ammo);
}

function playerEnemyOverlap(player, enemy) {
    if (!player.lastHit || game.getTime() - player.lastHit > 3000) {
        player.lastHit = game.getTime();
        player.setVelocityY(-300);
        player.setVelocityX(player.x < enemy.x ? -100 : 100);
        life -= 1;
        lifeText.setText(showLife());
        if (life <= 0) {
            gameOver();
        }
    }
}

function enterPortal(player, portal) {
    // Логіка для переходу на наступний рівень
    console.log('Next level');
    // Можна додати логіку для завантаження нового рівня або сцени
}

function gameOver() {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
}
