
class Skeleton extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y)
        this.worldWidth = x;
        this.worldHeight = y;

        this.x = Math.floor(Math.random() * this.worldWidth)
        this.y = Math.floor(Math.random() * this.worldHeight)

        scene.add.existing(this);
        this.setScale(3)

        this.scene.anims.create({
            key: "skel-left",
            frames: this.scene.anims.generateFrameNumbers("skeletonLeft", {
                start: 0,
                end: 11
            }),
            frameRate: 6,
        });


        this.timer = this.scene.time.addEvent({
            delay: 10000, loop: true, callback: function () {
                this.x = Math.floor(Math.random() * this.worldWidth)
                this.y = Math.floor(Math.random() * this.worldHeight)
                if (this.x < 200) {
                    this.x += 100;
                } if (this.y < 200) {
                    this.y += 100
                } if (this.x > 600) {
                    this.x -= 100
                } if (this.y > 600) {
                    this.x -= 100
                }
                this.play("skel-left")
            }, callbackScope: this
        });

    }

}
