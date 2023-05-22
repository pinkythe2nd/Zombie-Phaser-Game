var Scene2 = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:

        function Scene2() {
            Phaser.Scene.call(this, { key: "Scene2" })
        },

    preload: function () {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('bullet', 'assets/bullet.png');

        this.load.audio("warning", "assets/warning.ogg")
        this.load.audio("gameMusic", "assets/music.mp3")
        this.load.audio("reload", "assets/reload.wav")
        this.load.audio("reloadFast", "assets/reloadFast.wav")
        this.load.audio("reloadMiddle", "assets/reloadMiddle.mp3")
        this.load.audio("damage", "assets/damage.ogg")
        this.load.audio("jump", "assets/jump.wav")
        this.load.audio("shot", "assets/gunshot.wav")
        this.load.audio("fly", "assets/fly.wav")
        this.load.audio("unlock", "assets/unlock.wav")
        this.load.audio("zombieDeath", "assets/zombieDeath.wav")

        this.load.spritesheet("zombie", "assets/zombie.png", { frameWidth: 32, frameHeight: 64, endFrame: 36 });
        this.load.image("baseTiles", "assets/tileset.png");
        this.load.tilemapTiledJSON("tilemap", "assets/zombieMapEmbed.json");
        this.load.spritesheet("doorsTexture", "assets/doors.png", { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet("chestTexture", "assets/chests.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("spawnerTexture", "assets/spawner.png", { frameWidth: 32, frameHeight: 32 });

        this.player;
        this.timer;
        this.gameOver = false;
        this.bullets;
        this.enemyGroup;
    },

    create: function () {
        //variables
        this.delay = 0;
        this.enemySpawnerTimer = 0;
        this.enemyGroup = this.physics.add.group();
        this.warningPlaying = false

        this.doors = this.physics.add.staticGroup({
            classType: Door
        });
        this.chests = this.physics.add.staticGroup({
            classType: Chest
        })

        this.spawners = this.physics.add.staticGroup({
            classType: Spawner
        })

        this.bullets = this.add.group();
        this.weapons = [new Weapon(500, 100, false, 2000, 2),
        new Weapon(250, 15, true, 1250, 20),
        new Weapon(100, 10, true, 750, 30),
        new Weapon(1500, 200, false, 2000, 1),
        new Weapon(100, 25, true, 50, 40)];

        this.music = this.sound.add("gameMusic", { volume: 1 });
        this.reload = this.sound.add("reload", { volume: 0.75 });
        this.reloadFast = this.sound.add("reloadFast", { volume: 0.4 });
        this.reloadMiddle = this.sound.add("reloadMiddle", { volume: 0.4 });
        this.jump = this.sound.add("jump", { volume: 0.75 });
        this.hurt = this.sound.add("damage");
        this.shot = this.sound.add("shot", { volume: 0.25 });
        this.fly = this.sound.add("fly", { volume: 0.25 });
        this.unlock = this.sound.add("unlock");
        this.zombieDeath = this.sound.add("zombieDeath", { volume: 0.35 });

        this.music.play({ loop: true });

        this.timer = this.time.addEvent({ delay: 5000, loop: true, callback: this.timerUpdate, callbackScope: this });

        //map stuff
        const map = this.make.tilemap({ key: "tilemap", tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage("ZombieTilesetEmbed", "baseTiles");

        spawnerLayer = map.getObjectLayer('Spawners');
        background = map.createStaticLayer('Background', tileset).setScale(2);
        foreground = map.createStaticLayer('Foreground', tileset).setScale(2);
        wallsLayer = map.createStaticLayer('Walls', tileset).setScale(2);
        doorsLayer = map.getObjectLayer('Doors');
        chestLayer = map.getObjectLayer('Chests');
        floorLayer = map.createStaticLayer('Floor', tileset).setScale(2);

        let doorPrice = 150;
        let i = 1;
        doorsLayer.objects.forEach(doorObjs => {
            console.log(doorObjs.x, doorObjs.y)
            this.doors.add(new Door(this, (doorObjs.x * 2) + 16, (doorObjs.y * 2) - 32, doorPrice * i))
            i++
        })
        i = 0;
        chestLayer.objects.forEach(chestObjs => {
            this.chests.add(new Chest(this, (chestObjs.x * 2) + 16, (chestObjs.y * 2) - 16, this.weapons[i]))
            i++
        })

        spawnerLayer.objects.forEach(spawnerObjs => {
            this.spawners.add(new Spawner(this, (spawnerObjs.x * 2) + 32, (spawnerObjs.y * 2) - 32, 0));
        })

        debugGraphics = this.add.graphics();
        this.warning = this.sound.add("warning");
        this.player = new Player(this, 500, 1500, "player").setScale(2);
        this.timer2 = this.time.addEvent({
            delay: 1000, loop: true, callback: function () {
                if (this.player.health < 100) {
                    this.player.health += 1;
                    this.events.emit('playerHealth');
                } if (this.player.health > 20 && this.warningPlaying) {
                    this.warningPlaying = false;
                    this.warning.stop()
                }
            }, callbackScope: this
        });

        this.spawners.getChildren().sort(function (a, b) { return a.y - b.y }).reverse();

        let spawnerArray = this.spawners.getChildren();
        for (let i = 0; i < spawnerArray.length; i++) {
            spawnerArray[i].number = i;
        }
        console.log(this.spawners.getChildren())

        //collision
        //enemys
        this.physics.add.collider(this.enemyGroup)
        this.physics.add.collider(this.enemyGroup, this.bullets, this.enemyBulletCollision, null, this);
        this.physics.add.collider(this.enemyGroup, floorLayer, function (enemy, floor) {
            enemy.grounded = true;
        });
        this.enemyPlayerCollider = this.physics.add.overlap(this.enemyGroup, this.player, this.enemyPlayerCollision, null, this);
        this.physics.add.collider(this.enemyGroup, wallsLayer);
        this.physics.add.collider(this.enemyGroup, this.doors);
        //bullets
        this.physics.add.collider(this.bullets, wallsLayer, this.bulletCollision);
        this.physics.add.collider(this.bullets, floorLayer, this.bulletCollision);
        this.physics.add.collider(this.bullets, this.doors, this.bulletCollision)
        //player
        this.physics.add.collider(this.player, wallsLayer);
        this.physics.add.collider(this.player, floorLayer, this.floorTouch);

        this.physics.add.collider(this.player, this.chests, function (player, chest) {
            player.grounded = true;
            player.chest = chest;
            chest.show();
        });


        this.physics.add.collider(this.player, this.doors, function (player, door) {
            door.show();
            player.door = door;

        }, null, this);

        //camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 2, map.heightInPixels * 2);

        map.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {

            this.time.delayedCall(1000, () => {

                this.events.emit("SHUT_THE_FUCK_UP");
                this.scene.start("DeathScene")
            })
        }, this);

        this.events.emit('playerWealth');
        this.events.emit('playerHealth');
        this.events.emit('ammo');
        this.events.emit("fuelChange")

        floorLayer.setCollisionByProperty({collides: true});
        wallsLayer.setCollisionByProperty({collides: true});

    },

    enemyPlayerCollision: function (player, enemy) {
        console.log(this)
        if (player.grace == false) {
            player.health -= enemy.damage;
            player.grace = true;
            this.hurt.play()
            player.setTint("0xff0000")
            this.time.delayedCall(50, function () {
                player.clearTint()
            }, player)


            this.events.emit('playerHealth');
            this.time.delayedCall(750, function () {
                player.grace = false;
                player.clearTint()
            }, player)

        }

        if ((player.health <= 20) && (this.warningPlaying == false)) {
            this.warning.play({ loop: true });
            this.warningPlaying = true;
        }

        if (player.health <= 0 && this.player.active) {
            this.warning.stop()
            this.tweens.add({
                targets: this.music,
                volume: 0,
                duration: 2000
            });

            this.player.play("player-death")
            this.player.active = false;
            this.enemyPlayerCollider.active = false;
            this.cameras.main.fadeOut(1500, 200, 0, 0);
        }

    },

    timerUpdate: function () {
        var closest = null
        var min = Number.MAX_VALUE
        if (this.enemySpawnerTimer % 2 == 0 || this.enemySpawnerTimer > 20){
            this.spawners.getChildren().forEach(spawner => {
                console.log(spawner.number + "door int" + this.player.doorInt)
                if (spawner.number < this.player.doorInt) {
                    var distance = Phaser.Math.Distance.Between(spawner.x, spawner.y, this.player.x, this.player.y);
                    if (distance < min) {
                        closest = spawner;
                        min = distance;
                    }
                }
            })
            let enemy = new GameEnemy(this, closest.x, 50, 10, 100)
            enemy.y = closest.y
            this.enemyGroup.add(enemy)
            console.log("Spawn")
        }
        this.enemySpawnerTimer++
    },

    floorTouch: function (player) {
        player.grounded = true;
    },

    bulletCollision: function (bullet) {
        bullet.destroy();
    },

    enemyBulletCollision: function (bullet, enemy) {
        bullet.destroy();
        enemy.health -= this.player.weapon.damage;

        enemy.setTint("0xff0000")
        this.time.delayedCall(35, function () {
            enemy.clearTint()
        }, enemy)

        this.player.wealth += 10;
        this.events.emit('playerWealth');
        enemy.healthText.setText(enemy.health)
    },


    update: function (time, delta) {
        if (this.gameOver) {
            return;
        }
    }

});