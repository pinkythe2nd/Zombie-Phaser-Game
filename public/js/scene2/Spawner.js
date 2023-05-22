
class Spawner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, num) {
        super(scene, x, y, "spawnerTexture");

        scene.add.existing(this);

        this.setScale(2);
        this.number = num;
        this.showing = false;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }

    show() {
        if (!this.showing) {
            this.text = this.scene.add.text(this.x, this.y, this.number,
                { fontFamily: "Blackletter", fontSize: "36px", color: "#f00", strokeThickness: 3, stroke: "#100" })
            this.scene.time.delayedCall(2000, function () {
                this.text.destroy();
                this.showing = false;
            }, null, this);
            this.showing = true;
        }
    }

}
