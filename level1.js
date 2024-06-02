const config = {
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
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);
const worldWidth = 1200 * 3;
let cursors, grow, player;

function preload() {
    this.load.image('gamefon', 'assets/gamefon.png');
    this.load.image('grow', 'assets/grow.png');
    this.load.spritesheet('hero', 'assets/hero.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('startImage', 'assets/startImage.png');
}

function create() {
    const startImage = this.add.image(600, 275, 'startImage');
    const startText = this.add.text(600, 450, 'Натисніть, щоб почати гру', { font: '32px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.time.delayedCall(3000, () => { startImage.destroy(); startText.destroy(); startGame.call(this); }, [], this);
}

function startGame() {
    this.add.tileSprite(0, 0, worldWidth, 1080, "gamefon").setOrigin(0).setScale(1).setDepth(0);
    grow = this.physics.add.staticGroup();
    for (let x = 0; x < worldWidth; x += 128) grow.create(x, 560, "grow").setOrigin(0).refreshBody();

    player = this.physics.add.sprite(100, 500, 'hero').setBounce(0.2).setDepth(Phaser.Math.Between(4, 5)).setCollideWorldBounds(true).setScale(2);
    player.body.setGravityY(300);
    this.physics.add.collider(player, grow);
    cursors = this.input.keyboard.createCursorKeys();

    ['left', 'right'].forEach(dir => {
        this.anims.create({ key: dir, frames: this.anims.generateFrameNumbers('hero', { start: (dir === 'left' ? 0 : 5), end: (dir === 'left' ? 3 : 8) }), frameRate: 10, repeat: -1 });
    });
    this.anims.create({ key: 'turn', frames: [{ key: 'hero', frame: 4 }], frameRate: 20 });

    this.cameras.main.setBounds(0, 0, worldWidth, 650);
    this.cameras.main.startFollow(player, true, 0.05, 0.05);
}

function update() {
    const velocityX = cursors.left.isDown ? -160 : (cursors.right.isDown ? 160 : 0);
    player.setVelocityX(velocityX);
    player.anims.play((velocityX < 0 ? 'left' : (velocityX > 0 ? 'right' : 'turn')), true);

    if (cursors.up.isDown && player.body.touching.down) player.setVelocityY(-520);
}
