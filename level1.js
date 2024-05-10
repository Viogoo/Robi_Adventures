
var config = {
    // Задаємо тип фреймворку Phaser, щоб він автоматично визначав найкращий тип (WEBGL або CANVAS).
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    // Налаштовуємо фізичний движок гри.
    physics: {
        // Встановлюємо фізичний движок за замовчуванням на Arcade Physics.
        default: 'arcade',
        arcade: {
            gravity: { y: 170 },
            debug: false,
        }
    },
    // Задаємо об'єкт, який містить всі методи сцен (preload, create, update).
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var game = new Phaser.Game(config);

// Попереднє завантаження ресурсів
function preload() {
    this.load.image('gamefon', 'assets/gamefon.png');
    this.load.image('grow', 'assets/grow.png');
}

// Основна функція гри
function create() {
    this.add.image(0, 0, 'grow')
        .setOrigin(0);
}

// Функція оновлення
function update() {
}

