class Fire extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene, x, y, texture);
        scene.Physics.add.existing(this);
        scene.anims.create({
            key: "idle",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("idle");

        scene.add.existing(this);
    }
}