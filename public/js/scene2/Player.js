
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.1);
        this.setMass(0.01)
        this.fuel = 100;

        this.flipFlop = false;
        this.door = null;
        this.chest = null;
        this.wealth = 2000;
        this.health = 100;
        this.grace = false;
        this.flash = null;
        this.flashDelay = 0;
        this.weaponArray = [];
        this.weaponArray.push(new Weapon(750, 33, false, 1000, 7))
        //class attributes
        this.grounded = false;
        this.lastFired = 0;
        //this.cursors = this.scene.input.keyboard.createCursorKeys();
        //this.keys = this.scene.input.keyboard.addKeys('W, S, A, D, ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT');
        this.doorInt = 2;


        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyR = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.key1 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.key4 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.key5 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        this.key6 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        this.key7 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
        this.key8 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);

        this.weapon = this.weaponArray[0]

        this.refuelTime = 0;

        this.scene.anims.create({
            key: "player-idle",
            frames: this.scene.anims.generateFrameNumbers("player", { frames: [0] }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "player-walk",
            frames: this.scene.anims.generateFrameNumbers("player", { frames: [1, 2, 3, 4] }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "player-fly",
            frames: this.scene.anims.generateFrameNumbers("player", { frames: [5, 6, 7] }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "player-fall",
            frames: this.scene.anims.generateFrameNumbers("player", { frames: [8] }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "player-dash",
            frames: this.scene.anims.generateFrameNumbers("player", { frames: [9, 10, 11] }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "player-death",
            frames: this.scene.anims.generateFrameNumbers("player", { frames: [11, 12, 13, 14, 15, 16, 17] }),
            frameRate: 8,
            repeat: -1
        });
    }

    reload() {
        this.scene.events.emit('reload');
        if (this.weapon.reloadTime < 1000) {
            this.scene.reloadFast.play()
        } else if (this.weapon.reloadTime < 1600) {
            this.scene.reloadMiddle.play()
        } else if (this.weapon.reloadTime > 1600) {
            this.scene.reload.play()
        }
        this.scene.time.delayedCall(this.weapon.reloadTime, function () {
            this.weapon.currentMag = this.weapon.magCapacity
            this.scene.events.emit('ammo');
        }, null, this);
    }

    fire(time) {
        if (time > this.lastFired) { //delay to stop the spawning of a millions bullets all on top of each other... very bad for performance
            if (this.weapon.currentMag > 0) {
                this.scene.shot.play()
                this.scene.bullets.add(new Bullet(this.scene, this.x, this.y, "bullet", 500, this.pointer.worldY, this.pointer.worldX));
                this.weapon.currentMag--;
                this.scene.events.emit('ammo');
            } else {
                this.reload();
            }
            this.lastFired = time + this.weapon.fireRate;
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        //shooting
        this.pointer = this.scene.input.activePointer;
        if (this.pointer.leftButtonDown() && this.weapon.automatic) {
            this.fire(time);
        } if (this.pointer.leftButtonDown() && this.weapon.cocked) {
            this.fire(time);
            this.weapon.cocked = false;
        }

        if (this.pointer.leftButtonReleased()) {
            this.weapon.cocked = true;
        }

        if (this.keyR.isDown) {
            this.reload()
        }
        //movement 
        if (time > this.refuelTime && this.grounded && this.fuel < 150) {
            this.fuel += 1;
            this.scene.events.emit("fuelChange")
            this.refuelTime = time + 100;
        }

        if (this.keyW.isDown && this.grounded) {
            this.setVelocityY(-100);
            this.scene.jump.play();
        }

        if (this.keyW.isDown) {
            if (this.anims.getCurrentKey() !== "player-fly") {
                this.play("player-fly")
            } if (this.fuel > 0) {
                this.setVelocityY(this.body.velocity.y - 10);
                this.fuel -= 1;
                this.grounded = false;
                this.scene.events.emit("fuelChange")
                if (!this.scene.fly.isPlaying) {
                    this.scene.fly.play()
                }
            }
        }
        if (this.body.velocity.y > 1 && this.fuel == 0) {
            if (this.anims.getCurrentKey() !== "player-fall") {
                this.play("player-fall")
                this.scene.fly.stop()
            }
            return
        }
        if (this.keyA.isDown) {
            if ((this.anims.getCurrentKey() !== "player-walk") && this.grounded) {
                this.play("player-walk")
                this.scene.fly.stop()
            }
            this.flipX = true;
            this.setVelocityX(-200);
        }
        else if (this.keyD.isDown) {
            if ((this.anims.getCurrentKey() !== "player-walk") && this.grounded) {
                this.play("player-walk")
                this.scene.fly.stop()
            }
            this.flipX = false;
            this.setVelocityX(200);
        } else if (this.body.velocity.x == 0 && (this.body.velocity.y > -1 && this.body.velocity.y < 0)) {
            this.setVelocityX(0);
            this.play("player-idle")
        } else {
            this.setVelocityX(0)
        }

        if (this.key1.isDown) {
            this.weapon = this.weaponArray[0];
            this.scene.events.emit('ammo');
        }
        if (this.key2.isDown) {
            if (this.weaponArray.length > 1) {
                this.weapon = this.weaponArray[1];
                this.scene.events.emit('ammo');
            }
        }
        if (this.key3.isDown) {
            if (this.weaponArray.length > 2) {
                this.weapon = this.weaponArray[2];
                this.scene.events.emit('ammo');
            }
        }
        if (this.key4.isDown) {
            if (this.weaponArray.length > 3) {
                this.weapon = this.weaponArray[3];
                this.scene.events.emit('ammo');
            }
        }
        if (this.key5.isDown) {
            if (this.weaponArray.length > 4) {
                this.weapon = this.weaponArray[4];
                this.scene.events.emit('ammo');
            }
        }
        if (this.key6.isDown) {
            if (this.weaponArray.length > 5) {
                this.weapon = this.weaponArray[5];
                this.scene.events.emit('ammo');
            }
        }
        if (this.key7.isDown) {
            if (this.weaponArray.length > 6) {
                this.weapon = this.weaponArray[6];
                this.scene.events.emit('ammo');
            }
        }
        if (this.key8.isDown) {
            if (this.weaponArray.length > 7) {
                this.weapon = this.weaponArray[7];
                this.scene.events.emit('ammo');
            }
        }
        if (this.keyS.isDown && !this.flipFlop) {
            if (this.door != null && this.door.showing) {
                if (this.door.price <= this.wealth) {
                    this.doorInt += 2;
                    this.wealth -= this.door.price
                    this.door.open();
                    this.scene.events.emit('playerWealth');
                    this.scene.unlock.play()
                }
            }
            if (this.chest != null && this.chest.showing) {
                if (this.chest.price <= this.wealth) {
                    this.weaponArray.push(this.chest.weapon)
                    this.weapon = this.chest.weapon;
                    this.wealth -= this.chest.price
                    this.chest.open();
                    this.scene.events.emit('playerWealth');
                    this.scene.events.emit('ammo');
                    this.scene.unlock.play()
                }
            }
            this.flipFlop = true;
        }
        if (this.keyS.isUp) {
            this.flipFlop = false;
        }
    }

}