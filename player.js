class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        //  add to physics
        scene.physics.add.existing(this);
        //  create and load player animations
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

        //  allows player to collide with world boundaries
        this.setCollideWorldBounds(true);
        //  when player lands he bounces a tiny amount
        this.setBounce(0.2);
        //  shooting variables
        this.nextProjectileTime = 0;
        this.shootDelay = 200;
        //  default player direction is right
        this.playerDirection = "right";
        //  adds to scene
        scene.add.existing(this);
    }

    
    
    handleMovement(){ 
        //  const to see if player is touching ground
        const touchingGround = this.body.onFloor() || this.body.touching.down;

        //  player controls - right and left arrows to move player
        if(world.cursors.right.isDown) {
            this.body.setVelocityX(moveSpeed);
            this.playerDirection = "right"; 
            this.anims.play("move-right", true);
            
        } else if(world.cursors.left.isDown) {
            this.body.setVelocityX(-moveSpeed);
            this.playerDirection = "left";
            this.anims.play("move-left", true);
            
        } else {
            //  when not pressing left or right x velocity is 0
            this.setVelocityX(0);
            //  if player is touching ground play idle animations
            if(touchingGround){
                this.anims.play("idle-" + this.playerDirection, true);  
            }
        }
    }
    
    handleJump(){
        //  const to see if player is touching ground
        const touchingGround = this.body.onFloor() || this.body.touching.down;
        //  Allows for double jump after touching the ground
        if(Phaser.Input.Keyboard.JustDown(world.jumpButton) && (touchingGround || jumpCount < 1 )){
            this.anims.play("jump", true);
            this.setVelocityY(-jumpSpeed);
            jumpCount++;
        }
        //  when the player touches ground reset jumpcount
        if(touchingGround){jumpCount = 0};
    }
    
    updatePlayer(){
        //  handle user input
        this.handleMovement();
        this.handleJump();
        //  make sure player cant touch bottom of the screen
        this.checkBounds();

        // if shoot button is pressed shoot
        if(world.shootButton.isDown){
            this.shootProjectile(world.projectileGroup);
        };
    }
    
    loseGame(){
        //  moves the lose text to above the player
        loseText.x = this.x - world.TILEWIDTH;
        loseText.y = this.y - (world.TILEWIDTH * 2);
        //  displays the lose text  
        loseText.setText("YOU LOSE!");
        //  pauses the game
        game.scene.pause("game");
        //  starts the lose scene
        game.scene.start("lose");
    }

    damagePlayer(player, water){
        //  play damage sound
        world.takeDamageSFX.play();
        water.destroy();
        world.health -= 1;
        //  update ui
        livesInfo.setText("Lives: " + world.health);
        //  if player has no health end game
        if(world.health == 0){
            player.loseGame();
        } 
    }

    collectFire(fire){
        //  play pickup sound
        world.pickupSFX.play();
        fire.destroy();
        //  makes it so the player can only have 3 shots at a time
        if (world.currentProjectiles < 3){
            world.currentProjectiles += 1;
        } 
        //  update ui
        bulletInfo.setText("Fire Bullets: " + world.currentProjectiles);
    }

    collectRedFlame(redflame){
        //  play pickup sound
        world.pickupSFX.play();
        //  workout where to display points text
        pointsText.x = redflame.x - world.TILEWIDTH;
        pointsText.y = redflame.y - (world.TILEWIDTH * 2);
        //  display points text
        pointsText.setText("+" + redflame.redFlamePoints);
        redflame.destroy();
        //  add to collect score 
        world.collectScore += 500;
    }
    
    shootProjectile(projectileGroup){
        //  if the player has bullets
        if(world.currentProjectiles>0){
            //  if there has been enough time elapsed to shoot again
            if(this.scene.time.now > this.nextProjectileTime){
                //  play shoot sound
                world.shootSFX.play();
                //  add a projectile to the group
                projectileGroup.add(new Projectile(this.scene,this.x,this.y,"fire"),true);
                //  take a bullet away from the player
                world.currentProjectiles -= 1;
                //  update ui
                bulletInfo.setText("Fire Bullets: " + world.currentProjectiles);
                //  update time till next bullet
                this.nextProjectileTime = this.scene.time.now + this.shootDelay;
            }
        } 
    }

    checkBounds(){
        //  checks to see if the player has hit the bottom of the screen
        if(this.y >= config.height - world.TILEWIDTH){
            // destroy player and lose game
            this.destroy();
            this.loseGame();
        }
    }
}