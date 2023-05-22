class Weapon {
    constructor(fireRate, damage, automatic, reloadTime, magCapacity) {
        this.fireRate = fireRate;
        this.damage = damage;
        this.automatic = automatic;
        this.reloadTime = reloadTime;
        this.magCapacity = magCapacity;
        this.currentMag = magCapacity;
        this.cocked = true;
    }
}
