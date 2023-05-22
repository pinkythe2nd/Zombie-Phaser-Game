var DeathScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function DeathScene() {
            Phaser.Scene.call(this, { key: 'DeathScene' });
        },

    preload: function () {
        this.load.audio("endmusic", "assets/endmusic.mp3");
        this.load.spritesheet('skeletonLeft', 'assets/idle_left.png', { frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('skeletonRight', 'assets/idle_right.png', { frameWidth: 50, frameHeight: 50 });
    },


    create: function () {
        let { width, height } = this.sys.game.canvas;
        this.music = this.sound.add("endmusic", { volume: 0.75 });

        this.cameras.main.fadeIn(1000, 0, 0, 0)
        this.music.play({ loop: true });


        this.add.image(400, 300, 'sky').setScale(0.5);
        this.add.sprite(new ImageButtonText(this, width / 2, height / 4 * 2, "button", "Play Again"));
        this.add.text(width / 2 - 105, height / 4 - 50, "YOU DIED !",
            { fontFamily: "Blackletter", fontSize: "46px", color: "#f00", strokeThickness: 3, stroke: "#100" });

        this.skeleton = this.add.sprite(new Skeleton(this, width, height))
        this.delay = 0;
        this.flip = false;
    }

})

