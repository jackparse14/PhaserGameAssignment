class Player extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.physics.add.existing(this);
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

        scene.anims.create({
            key: "moveRight",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 8,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("moveRight");

        scene.anims.create({
            key: "moveLeft",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 9,
                end: 9,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("moveLeft");

        scene.anims.create({
            key: "jump",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 10,
                end: 15,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("jump");

        this.setCollideWorldBounds(true);
        this.setBounce(0.2);

        scene.add.existing(this);
    }

    handleMovement(){ 
        const touchingGround = this.body.onFloor() || this.body.touching.down;
        if(world.cursors.right.isDown) {
            this.anims.play("moveRight", true);
            this.setVelocityX(moveSpeed);
        } else if(world.cursors.left.isDown) {
            this.anims.play("moveLeft", true);
            this.setVelocityX(-moveSpeed);
        } else {
            this.anims.play("idle", true);
            this.setVelocity(0) ;
        }
    }
    
    handleJump(){
        const touchingGround = this.body.onFloor() || this.body.touching.down;
        if(Phaser.Input.Keyboard.JustDown(world.jumpButton) && (touchingGround || jumpCount < 1 )){
            this.anims.play("jump", true);
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
