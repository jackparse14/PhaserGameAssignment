class Projectile extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene, x, y,texture);
        //  add to physics
        scene.physics.add.existing(this);
        //  make bullets smaller than pickup
        this.setScale(.75);
        //  decide projectile direction on creation
        this.projectileDirection = world.player.playerDirection;
        this.chooseDirection();
    }
    updateProjectile(){
        //  makes projectile shoot to left or right
        this.x += this.speed;
        //  rotates projectile
        this.angle += 10;
        //  if the projectile goes of the screen it dies
        if (this.x > this.scene.game.width || this.x < 0 || this.y > this.scene.game.height || this.y < 0) {
            this.destroy();
        }
    }

    chooseDirection(){
        //  changed speed variable depending on direction
        if (this.projectileDirection == "left"){
            this.speed = -5;
        } else if (this.projectileDirection == "right") { 
            this.speed = 5;
        }
    }
}