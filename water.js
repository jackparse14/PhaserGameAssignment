class Water extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);   
        scene.physics.add.existing(this);
        scene.anims.create({
            key: "water-idle",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("water-idle");

        scene.add.existing(this);
    }

    updateWater(){
        this.anims.play("water-idle", true);
        this.moveWater();
    }

    moveWater(){
        this.angle += 10;
        var distanceToPlayer = Phaser.Math.Distance.Between(this.x,this.y,world.player.x,world.player.y);
        if(distanceToPlayer<300){
                const x = this.x;
                const y = this.y
                if(x<world.player.x){
                    this.x += 0.5;
                } else if (x>world.player.x){
                    this.x -= 0.5;
                }
                if(y<world.player.y){
                    this.y += 0.5;
                } else if (y>world.player.y){
                    this.y -= 0.5;
                }   
        };
    }
}