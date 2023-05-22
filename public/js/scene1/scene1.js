

var Scene1 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function Scene1() {
            Phaser.Scene.call(this, { key: 'Scene1' });
        },

    preload: function () {
        this.canvas = this.sys.game.canvas;
        this.load.image('sky', 'assets/background.jpg');
        this.load.image("button", "assets/button.png");
        this.load.audio("music", "assets/introloop.mp3");
        this.load.audio("zombieMusic", "assets/zombie.wav");
        this.load.image('ground', 'assets/ground.png');
        this.load.spritesheet("zombie", "assets/zombie.png", { frameWidth: 32, frameHeight: 64, endFrame: 36 });
    },

    create: function () {
        let { width, height } = this.sys.game.canvas;

        this.music = this.sound.add("music", { volume: 0.6 });
        this.music.play({ loop: true });

        this.timer = this.time.addEvent({ delay: 1000, loop: true, callback: this.timerUpdate, callbackScope: this });

        platforms = this.physics.add.staticGroup();
        platforms.create(400, 600, 'ground').setScale(x = 2, y = 1).refreshBody();
        this.enemyGroup = this.physics.add.group();
        this.physics.add.collider(this.enemyGroup, platforms);
        this.physics.add.collider(this.enemyGroup)


        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(1000, () => {
                this.scene.start("Scene2")
            })
        }, this);


        this.add.image(400, 300, 'sky').setScale(0.5);
        this.add.sprite(new ImageButtonText(this, width / 2, height / 4 * 2, "button", "Play Game"));
        this.add.text(width / 2 - 105, height / 4, "Zombie Game!", { fontFamily: "Blackletter", fontSize: "36px", color: "#f00", strokeThickness: 3, stroke: "#100" });
    },

    timerUpdate: function () {
        this.enemyGroup.add(new IntroEnemy(this, Math.floor(Math.random() * 600), 50));
    },


    update: function () {
    }

});
