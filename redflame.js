class RedFlame extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);
        //  add to physics
        scene.physics.add.existing(this);
        //  create redflame idle animation
        scene.anims.create({
            key: "redflame-idle",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("redflame-idle");
        //  points variable for red flames
        this.redFlamePoints = 500;
        //  add to scene
        scene.add.existing(this);
    }
    updateRedFlame(){
        //  plays the redflame idle animation
        this.anims.play("redflame-idle", true);
    }
}