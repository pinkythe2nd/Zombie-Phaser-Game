


var UIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function UIScene() {
            Phaser.Scene.call(this, { key: 'UIScene', active: true });
        },

    create: function () {
        this.game = this.scene.get('Scene2');
        //  Our Text object to display the Score
        this.playerWealthText = this.add.text(5, 10, '',
            { fontFamily: "Blackletter", fontSize: "18px", color: "#FFD700", strokeThickness: 3, stroke: "#100" });

        this.playerHealthText = this.add.text(5, 30, "",
            { fontFamily: "Blackletter", fontSize: "18px", color: "#f00", strokeThickness: 3, stroke: "#100" });

        this.playerAmmoCount = this.add.text(5, 50, "",
            { fontFamily: "Blackletter", fontSize: "18px", color: "#00aa00", strokeThickness: 3, stroke: "#100" });

        this.fuelText = this.add.text(5, 70, "",
            { fontFamily: "Blackletter", fontSize: "18px", color: "#FFA500", strokeThickness: 3, stroke: "#100" });

        //  Grab a reference to the Game Scene
        //  Listen for events from it
        this.game.events.on('playerWealth', function () {
            this.playerWealthText.setText('Wealth: ' + this.game.player.wealth);

        }, this);

        this.game.events.on('ammo', function () {
            this.playerAmmoCount.setText("Ammo: " + this.game.player.weapon.currentMag + "/" + this.game.player.weapon.magCapacity);

        }, this);

        this.game.events.on('playerHealth', function () {
            this.playerHealthText.setText('Health: ' + this.game.player.health);

        }, this);

        this.game.events.on('reload', function () {
            this.playerAmmoCount.setText("Reloading");

        }, this);

        this.game.events.on('fuelChange', function () {
            this.fuelText.setText("Fuel: " + this.game.player.fuel);

        }, this);

        this.game.events.on("SHUT_THE_FUCK_UP", function () {
            this.playerAmmoCount.setText("")
            this.playerHealthText.setText("")
            this.fuelText.setText("")
        }, this)

    }

});

