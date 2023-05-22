class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, price) {
        super(scene, x, y);

        scene.add.existing(this);
        //scene.physics.add.existing(this);

        this.setScale(2)
        this.showing = false;
        this.opened = false;
        this.price = price
        this.scene.anims.create({
            key: "door-closed",
            frames: this.scene.anims.generateFrameNumbers("doorsTexture", { frames: [0] }),
            frameRate: 5
        });

        this.scene.anims.create({
            key: "door-open",
            frames: this.scene.anims.generateFrameNumbers("doorsTexture", { frames: [1] }),
        });
        this.play("door-closed")
    }

    show() {
        if (!this.showing) {
            this.text = this.scene.add.text(this.x, this.y, "Door Costs: " + this.price,
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
            this.play("door-open")
            this.opened = true;
            this.active = false
            this.scene.doors.remove(this)
        }
    }

}
