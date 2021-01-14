class Projectile extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene, x, y,texture);
        scene.physics.add.existing(this);
        this.setScale(.75);
        this.projectileDirection = world.player.playerDirection;
        this.chooseDirection();
    }
    updateProjectile(){
        this.x += this.speed;
        this.angle += 10;
        if (this.x > this.scene.game.width || this.x < 0 || this.y > this.scene.game.height || this.y < 0) {
            this.destroy();
        }
    }

    chooseDirection(){
        if (this.projectileDirection == "left"){
            this.speed = -5;
        } else if (this.projectileDirection == "right") { 
            this.speed = 5;
        }
    }
}