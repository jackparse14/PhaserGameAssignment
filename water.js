class Water extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);   
        //  add to physics
        scene.physics.add.existing(this);
        //  create water idle animation
        scene.anims.create({
            key: "water-idle",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1
        });
        //  load water idle animation
        this.anims.load("water-idle");
        //  points variable for water
        this.waterPoints = 1000;
        //  add to scene
        scene.add.existing(this);
    }

    updateWater(){
        //  play water idle animation
        this.anims.play("water-idle", true);
        //  runs moveWater method
        this.moveWater();
    }

    moveWater(){
        //  rotates the sprite fast
        this.angle += 10;
        //  calculates the distance between the player and water
        var distanceToPlayer = Phaser.Math.Distance.Between(this.x,this.y,world.player.x,world.player.y);
        //  if the distance is less than 300 pixels
        if(distanceToPlayer<300){
                const x = this.x;
                const y = this.y
                //  moves the water towards the player
                if(x<world.player.x){
                    this.x += 1;
                } else if (x>world.player.x){
                    this.x -= 1;
                }
                if(y<world.player.y){
                    this.y += 1;
                } else if (y>world.player.y){
                    this.y -= 1;
                }   
        };
    }
}