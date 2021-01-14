class Player extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        scene.physics.add.existing(this);
        
        scene.anims.create({
            key: "idle-right",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 7,                         
            }),
            frameRate: 10,
            repeat: -1  
        });
        this.anims.load("idle-right");

        scene.anims.create({
            key: "idle-left",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 8,
                end: 15,                         
            }),
            frameRate: 10,
            repeat: -1  
        });
        this.anims.load("idle-left");

        scene.anims.create({
            key: "move-right",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 16,
                end: 16,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("move-right");

        scene.anims.create({
            key: "move-left",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 17,
                end: 17,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("move-left");
        
        scene.anims.create({
            key: "jump",
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 18,
                end: 23,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load("jump");
        
        

        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.nextProjectileTime = 0;
        this.shootDelay = 200;
        this.playerDirection = "right";
        scene.add.existing(this);
    }

    
    
    handleMovement(){ 
        const touchingGround = this.body.onFloor() || this.body.touching.down;
        if(world.cursors.right.isDown) {
            this.setVelocityX(moveSpeed);
            this.playerDirection = "right"; 
            this.anims.play("move-right", true);
            
        } else if(world.cursors.left.isDown) {
            this.setVelocityX(-moveSpeed);
            this.playerDirection = "left";
            this.anims.play("move-left", true);
            
        } else {
            this.setVelocity(0)
            this.anims.play("idle-" + this.playerDirection, true);
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
        this.checkBounds();
        if(world.shootButton.isDown){
            this.shootProjectile(world.projectileGroup);
        };
    }
    
    loseGame(){
        //moves the lose text to above the player
        loseText.x = this.x - world.TILEWIDTH;
        loseText.y = this.y - (world.TILEWIDTH * 2);
        //displays the lose text  
        loseText.setText("YOU LOSE!");
        //pauses the game
        game.scene.pause("default");
    }

    damagePlayer(player, water){
        world.takeDamageSFX.play();
        water.disableBody(true,true);
        world.health -= 1;
        if(world.health == 0){
            player.loseGame();
        } 
    }

    collectFire(fire){
        world.pickupSFX.play();
        fire.disableBody(true,true);
        if (world.currentProjectiles < 3){
            world.currentProjectiles += 1;
        } 
    }
    
    shootProjectile(projectileGroup){
        if(world.currentProjectiles>0){
            if(this.scene.time.now > this.nextProjectileTime){
                world.shootSFX.play();
                projectileGroup.add(new Projectile(this.scene,this.x,this.y,"fire"),true);
                world.currentProjectiles -= 1;
                this.nextProjectileTime = this.scene.time.now + this.shootDelay;
            }
        } 
    }

    checkBounds(){
        if(this.y >= config.height - world.TILEWIDTH){
            this.destroy();
            this.loseGame();
        }
    }
}