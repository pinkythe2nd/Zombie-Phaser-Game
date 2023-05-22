class Chest extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, weapon) {
        super(scene, x, y);

        scene.add.existing(this);
        //scene.physics.add.existing(this);
        this.setScale(2);
        this.opened = false;
        this.showing = false;
        this.weapon = weapon;
        this.price = 100;

        this.scene.anims.create({
            key: "chest-closed",
            frames: this.scene.anims.generateFrameNumbers("chestTexture", { frames: [0] }),
            frameRate: 5
        });

        this.scene.anims.create({
            key: "chest-open",
            frames: this.scene.anims.generateFrameNumbers("chestTexture", { frames: [1] }),
        });
        this.play("chest-closed")
    }

    show() {
        if (!this.showing) {
            this.text = this.scene.add.text(this.x, this.y, "New Weapon costs: " + this.price,
                { fontFamily: "Blackletter", fontSize: "36px", color: "#f00", strokeThickness: 3, stroke: "#100" })
            this.scene.time.delayedCall(2000, function () {
                this.text.destroy();
                this.showing = false;
            }, null, this);
            this.showing = true;
        }
    }

    open() {
        if (this.opened == false) {
            this.play("chest-open")
            this.opened = true;
            this.active = false;
            this.scene.chests.remove(this)
        }
    }
}
