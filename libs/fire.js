class Fire extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene, x, y, texture);  
        //  add to physics
        scene.physics.add.existing(this);
        //  create fire idle animation
        scene.anims.create({
            key: "fire-idle",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1
        });
        //  load fire idle animation
        this.anims.load("fire-idle");
        //  add to scene
        scene.add.existing(this);
    }

    updateFire(){
        //  play fire idle animation
        this.anims.play("fire-idle", true);
    }
}