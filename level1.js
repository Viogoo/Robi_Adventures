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
var key;
var enemy; // Об'єкт для ворога
var enemyHealth = 3; // Здоров'я ворога

function preload() {
    // Створюємо об'єкт cursors, щоб слідкувати за натисканням клавіш курсору.
    cursors = this.input.keyboard.createCursorKeys();

    this.load.image('gamefon', 'assets/gamefon.png');
    this.load.image('grow', 'assets/grow.png');
    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('stimage', 'assets/gamet.png');
    this.load.image('cpase', 'assets/cpase.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('key', 'assets/key.png');
    this.load.image('enemy', 'assets/enemy.png');
}

function create() {
    this.add.tileSprite(0, 0, worldWidth, 1080, "gamefon")
        .setOrigin(0, 0)
        .setScale(1)
        .setDepth(0);

    // Відобразіть стартове зображення
    stimage = this.add.image(200, 325, 'stimage');
    stimage = this.add.image(900, 325, 'cpase');

    // Додайте текст під зображенням
    startText = this.add.text(200, 390, 'Кнопки керування', { font: '32px Arial', fill: '#ffffff' })
        .setOrigin(0.5, 0.5);

    startText = this.add.text(900, 390, 'Постріл', { font: '32px Arial', fill: '#ffffff' })
        .setOrigin(0.5, 0.5);
   
    startText = this.add.text(1700, 390, 'Збери 3 ключі, щоб потрапити на 2 рівень', { font: '32px Arial', fill: '#ffffff' })
        .setOrigin(0.5, 0.5);

    grow = this.physics.add.staticGroup();

    for (var x = 0; x < worldWidth; x += 128) {
        grow.create(x, 560, "grow").setOrigin(0, 0).refreshBody();
    }

    player = this.physics.add.sprite(100, 500, 'hero');
    player.setBounce(0.2)
        .setDepth(Phaser.Math.Between(4, 5))
        .setCollideWorldBounds(true)
        .setScale(2); // Збільшуємо розмір персонажа вдвічі

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

    // Додаємо кнопку для перезапуску гри.
    var resetButton = this.add.text(550, 70, '♻️', { fontSize: '60px', fill: '#FFF' })
        .setInteractive()
        .setScrollFactor(0);
    resetButton.on('pointerdown', () => {
        console.log('restart');
        this.scene.restart();
    });

    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);
    this.cameras.main.startFollow(player, true, 0.1, 0, 0, 300); // Слідкуємо за гравцем по горизонталі з невеликим затримкою, без вертикального слідкування

    // Додаємо обробник події натискання пробілу для стрільби з гравця.
    this.input.keyboard.on('keydown-SPACE', shootBullet, this);
    // Створюємо групу для куль та додаємо колізію між кулями та ворогом.
    bullets = this.physics.add.group();

    // Встановлюємо текст для показу кількості очок та життів гравця.
    scoreText = this.add.text(20, 60, 'Keys: 0', { fontSize: '20px', fill: '#FFF' })
        .setOrigin(0, 0)
        .setScrollFactor(0);
    lifeText = this.add.text(20, 35, showLife(), { fontSize: '20px', fill: '#FFF' })
        .setOrigin(0, 0)
        .setScrollFactor(0);

    // Додаємо ключ на конкретній позиції
    key = this.physics.add.sprite(1700, 500, 'key'); // Замінити 600, 500 на потрібні координати
    this.physics.add.collider(key, grow); // Колізія з платформами
    this.physics.add.overlap(player, key, collectKey, null, this); // Колізія з гравцем

    // // Додаємо ворога на конкретній позиції
    // enemy = this.physics.add.sprite(2500, 500, 'enemy'); // Замінити 800, 500 на потрібні координати
    // enemy.health = enemyHealth; // Присвоюємо ворогу початкове здоров'я
    // this.physics.add.collider(enemy, grow); // Колізія з платформами
    // this.physics.add.overlap(bullets, enemy, hitEnemyWithBullet, null, this); // Колізія з кулями
 // Створюємо ворога та додаємо колізію між гравцем та ворогом.
 enemy = this.physics.add.sprite(2500, 500, 'enemy');
 enemy.dead = false; // Додаємо цю стрічку
 this.physics.add.collider(enemy,grow);
 this.physics.add.collider(player, enemy, hitEnemy, null, this);



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
}

// Метод, який стріляє кулею.
function shootBullet() {
    // Створюємо кулю та задаємо їй початкову позицію та швидкість залежно від напрямку руху гравця.
    var bullet = bullets.create(player.x, player.y, 'bullet');
    bullet.body.allowGravity = false;
    if (player.body.velocity.x < 0) {
        bullet.setVelocityX(-2000);
    } else {
        bullet.setVelocityX(2000);
    }
}

// Метод, який повертає рядок, що відображає кількість життів гравця.
function showLife() {
    var lifeLine = 'Life: ';
    for (var i = 0; i < life; i++) {
        lifeLine += '❤️';
    }
    return lifeLine;
}

function collectKey(player, key) {
    key.disableBody(true, true); // Видалити ключ
    score += 1;
    scoreText.setText('Keys: ' + score);
}

function hitEnemyWithBullet(bullet, enemy) {
    bullet.disableBody(true, true); // Видалити кулю
    enemy.health -= 1;

    if (enemy.health <= 0) {
        enemy.disableBody(true, true); // Видалити ворога
    }
}



// Метод, який обробляє зіткнення гравця з ворогом.
function hitEnemy(player, enemy) {
    // Зменшуємо кількість життів гравця.
    life--;
    // Оновлюємо текст, що відображає кількість життів гравця.
    lifeText.setText(showLife());

    // Перевіряємо, з якого боку зіткнувся гравець з ворогом та змінюємо його швидкість.
    if (player.x < enemy.x) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(-200);
    }
    player.setVelocityY(-400);

    // Якщо кількість життів стає менше або дорівнює нулю, гру призупиняємо та відображаємо гравця як пошкодженого.
    if (life <= 0) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
    }
}


// Метод, який обробляє зіткнення кулі з ворогом.
function hitEnemyWithBullet(enemy, bullet) {
    // Зменшуємо кількість життів ворога.
    enemyLives--;
  
    // Знищуємо кулю.
    bullet.destroy();

    // Змінюємо швидкість ворога після зіткнення з кулею.
    if (player.x < enemy.x) {
        enemy.setVelocityX(10);
    } else {
        enemy.setVelocityX(-10);
    }
    enemy.setVelocityY(-100);

    // Якщо кількість життів ворога стає менше або дорівнює нулю і ворог ще не мертвий, знищуємо ворога.
    if (enemyLives <= 0 && !enemy.dead) {
        enemy.dead = true;
        enemy.destroy();
    }
}