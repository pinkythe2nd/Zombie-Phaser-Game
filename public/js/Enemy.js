
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.width = 32;
        this.heigth = 48
        this.body.setSize(32, 48, true)
        this.body.setOffset(0, y - 33)

        this.scene.anims.create({
            key: "zomb-idle",
            frames: this.scene.anims.generateFrameNumbers("zombie", { frames: [3, 4, 5, 6, 7, 8] }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "zomb-left",
            frames: this.scene.anims.generateFrameNumbers("zombie", { frames: [12, 13, 14, 15, 16, 17] }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "zomb-right",
            frames: this.scene.anims.generateFrameNumbers("zombie", { frames: [21, 22, 23, 24, 25, 26] }),
            frameRate: 8,
            repeat: -1
        });
        this.play("zomb-idle")
    }
}
