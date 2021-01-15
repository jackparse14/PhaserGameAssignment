class RedFlame extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);
        scene.physics.add.existing(this);
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
        this.redFlamePoints = 500;
        scene.add.existing(this);
    }
    updateRedFlame(){
        this.anims.play("redflame-idle", true);
    }
}