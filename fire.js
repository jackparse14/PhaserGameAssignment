class Fire extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene, x, y, texture);  
        scene.physics.add.existing(this);
        scene.anims.create({
            key: "fire-idle",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("fire-idle");

        scene.add.existing(this);
    }

    updateFire(){
        this.anims.play("fire-idle", true);
        this.angle += 0.1;
    }
}