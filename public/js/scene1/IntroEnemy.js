class IntroEnemy extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);

        if ((Math.floor(Math.random() * 10) % 2) == 0) {
            this.speed = -100;
            this.play("zomb-left")
        } else {
            this.speed = 100;
            this.play("zomb-right")
        }

    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.setVelocityX(this.speed);
        if (this.x < 0 || this.x > this.scene.cameras.main.width || this.y < 0 || this.y > this.scene.cameras.main.height) {
            this.destroy();         //destroys the bullet completly and allows the browsers garbage collector to recover memory
        }

    }

}