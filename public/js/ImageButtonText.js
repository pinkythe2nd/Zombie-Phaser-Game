
class ImageButtonText extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, text) {
        super(scene, x, y, texture)
        this.zombieMusic = this.scene.sound.add("zombieMusic", { volume: 1.55 });
        scene.add.existing(this);
        this.setScale(0.6);
        this.setInteractive({}).on("pointerover", () => this.hover()).on("pointerdown", () => this.click()).on("pointerout", () => this.rest()).on("pointerup", () => this.up());

        this.text = scene.add.text(x - this.displayWidth / 4 - 10, y - this.displayHeight / 4 + 10, text,
            { fontFamily: "Blackletter", fontSize: "36px", color: "#f00", strokeThickness: 3, stroke: "#100" })
    }

    hover() {
        this.text.setScale(1.1);
        this.text.setX(this.text.x - 10);
    }

    rest() {
        this.text.setScale();
        this.text.setX(this.text.x + 10);
    }

    click() {
        this.setScale(0.62)
        this.scene.cameras.main.fadeOut(1500, 200, 0, 0);
        this.zombieMusic.play();
        //this.scene.music.stop()
        this.scene.tweens.add({
            targets: this.scene.music,
            volume: 0,
            duration: 2000
        });
    }

    up() {
        this.setScale(0.6);
    }

}