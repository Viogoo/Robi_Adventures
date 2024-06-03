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
var worldWidth = 3000;
var cursors;
var grow;
var player;
var stimage
var startText;






function preload() {

 // Створюємо об'єкт cursors, щоб слідкувати за натисканням клавіш курсору.
 cursors = this.input.keyboard.createCursorKeys();

    this.load.image('gamefon', 'assets/gamefon.png');
    this.load.image('grow', 'assets/grow.png');
    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('stimage', 'assets/gamet.png');
    this.load.image('cpase', 'assets/cpase.png');
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





    grow = this.physics.add.staticGroup();

    for (var x = 0; x < worldWidth; x = x + 128) {
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
    resetButton.on('pointerdown', function () {
        console.log('restart');
        location.reload();
    });



    // // Налаштування камери
    // this.cameras.main.setBounds(0, 0, worldWidth, 0); // Встановлюємо межі камери
    // this.cameras.main.startFollow(player, true, 0.1, 0, 0, 300); // Слідкуємо за гравцем по горизонталі з невеликим затримкою, без вертикального слідкування

    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);
    this.cameras.main.startFollow(player, true, 0.1, 0, 0, 300); // Слідкуємо за гравцем по горизонталі з невеликим затримкою, без вертикального слідкування
    

    
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
