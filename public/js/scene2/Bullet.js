class Bullet extends Phaser.Physics.Arcade.Sprite { //inherits from the phaser arcade sprite so it has physics capabilties
    constructor(scene, x, y, texture, speed, pointerY, pointerX) {
        super(scene, x, y, texture); //calling parent class

        scene.add.existing(this);
        scene.physics.add.existing(this); //adding itself to the scene first and the to the physics

        this.speed = speed; //class variables
        this.previousUpdate = 0;

        let angleDeg = (Math.atan2(pointerY - y, pointerX - x) * 180 / Math.PI); //calculating the angle from where the playing is standing and where the user clicked
        this.setAngle(angleDeg); //setting the angle of the bullet sprite
        this.body.setAllowGravity(false); //disabling gravity
        this.scene.physics.moveTo(this, pointerX, pointerY, speed) //moving bullet to where the user clicked at defined speed

    }

    preUpdate(time, delta) { //called very often
        super.preUpdate(time, delta);
    }
}