class Player extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.physics.add.existing(this);
        scene.anims.create({
            key: "idle",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 6,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("idle");

        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.setGravityY(12000);

        scene.add.existing(this);
    }

    handleMovement(){ 
        if(world.cursors.right.isDown) {
            this.setVelocityX(moveSpeed);
        } else if(world.cursors.left.isDown) {
            this.setVelocityX(-moveSpeed);
        } else {
            this.anims.play("idle", true);
            this.setVelocity(0) ;
        }
    }

    handleJump(){
        const touchingGround = this.body.onFloor() || this.body.touching.down;
        if(Phaser.Input.Keyboard.JustDown(world.jumpButton) && (touchingGround || jumpCount < 1 )){
            this.setVelocityY(-jumpSpeed);
            jumpCount++;
        }
        if(touchingGround){jumpCount = 0};
    }
    updatePlayer(){
        this.handleMovement();
        this.handleJump();
    }
}
