class GameEnemy extends Enemy {
    constructor(scene, x, y, damage, health) {
        super(scene, x, y);
        this.grounded = false;
        this.facing = 0;
        this.setScale(1.2)
        this.health = health
        this.damage = damage
        this.jump = 0;
        this.healthText = this.scene.add.text(this.x - 5, this.y - 35, this.health,
            { fontFamily: "Blackletter", fontSize: "12px", color: "#FF0000", strokeThickness: 3, stroke: "#100" })
    }


    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.health <= 0) {
            this.scene.zombieDeath.play()
            this.destroy();
            this.healthText.destroy();
            return;
        }

        let velocity = this.body.velocity
        if (!this.grounded) {
            this.healthText.setPosition(this.x - 5, this.y - 35)
            return
        } if (velocity.y != 0) {
            this.grounded = false;
        }

        this.scene.physics.moveToObject(this, this.scene.player, 200);

        if (this.y > this.scene.player.y) {
            this.setVelocityY(-this.jump)
            this.jump += 10;
        } else {
            this.jump = 0;
        }

        if (this.jump >= 500){
            this.jump = 500;
        }

        if (this.x - this.scene.player.x > 0) {
            if (this.anims.getCurrentKey() !== "zomb-left") {
                this.play("zomb-left")
            }
        }
        if (this.x - this.scene.player.x < 0) {
            if (this.anims.getCurrentKey() !== "zomb-right") {
                this.play("zomb-right")
                this.facing = -1;
            }
        } if (velocity.x == 0) {
            if (this.anims.getCurrentKey() !== "zomb-idle") {
                this.play("zomb-idle")
            }
        }
        this.healthText.setPosition(this.x - 5, this.y - 35)
    }

}