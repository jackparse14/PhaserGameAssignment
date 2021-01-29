let world = {
    //game
    ROWS: 20,
    COLUMNS: 20,
    TILEWIDTH: 32,
    mainTileset: null,
    groundLayer: null,
    map: null,
    //scores
    timeScore: 0,
    killScore:0,
    collectScore:0,
    //controls
    cursors: null,
    jumpButton: null,
    shootButton: null,
    //player
    player: null,
    health: 3,
    currentProjectiles: 1,
    //groups
    projectileGroup: null,
    waterGroup: null,
    fireGroup: null,
    redFlameGroup: null,
    //finish
    finishLine: null,
    //sound
    backgroundMusic: null,
    shootSFX: null,
    pickupSFX: null,
    takeDamageSFX: null,
    //hud
    timerText: null,
    timerLength: 120000
};

class GameScene extends Phaser.Scene{
    constructor(){
        super({key:"game"})
    }

    //  PRELOAD ******************************************************************************************************************************
    preload (){
        this.preloadImages();
        this.preloadSpritesheets();
        this.preloadTileMap();
        this.preloadAudio();
    }
    preloadImages(){
        //  loads all images
        this.load.image("sky", "./assets/Images/sky.png");  
        this.load.image("mountains","./assets/Images/mountains.png");
        this.load.image("fields","./assets/Images/fields.png");
        this.load.image("floor","./assets/Images/Pillars.png");
        this.load.image("mainTiles","./assets/Tilesets/MainTileSheet_Extruded.png");
        this.load.image("start","./assets/Images/start.png");
        this.load.image("finish","./assets/Images/Finish.png");
    }
    preloadAudio(){
        //  loads audio
        this.load.audio("backgroundMusic",["./assets/Audio/mainBackgroundAudio.mp3"]);
        this.load.audio("shootSFX",["./assets/Audio/shoot.mp3"]);
        this.load.audio("takeDamageSFX",["./assets/Audio/takeDamage.mp3"]);
        this.load.audio("pickupSFX",["./assets/Audio/pickup.mp3"]);
    }
    preloadSpritesheets(){
        //  loads spritesheets
        this.load.spritesheet("player","./assets/Sprites/Player/FlameCharacter-Spritesheet.png", {
            frameWidth: 32,
            frameHeight: 64 
        });

        this.load.spritesheet("fire","./assets/Sprites/Flame-Spritesheet.png",{
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet("water","./assets/Sprites/Water-Spritesheet.png",{
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("redFlame","./assets/Sprites/RedFlame-Spritesheet.png",{
            frameWidth: 32,
            frameHeight: 32
        });
    }
    preloadTileMap(){
        //  loads tilemap
        this.load.tilemapTiledJSON("map", "./assets/Tilemaps/map.json");
    }

    //  CREATE ******************************************************************************************************************************
    create (){
        //  runs all the create functions
        this.createBounds();
        this.createBackground();
        this.buildWorld(this,world);
        this.createStartFinish();
        this.createControls();
        this.createGameObjects();
        this.createAudio();
        this.createText();
        this.showUI();
        this.createTimer();
        this.createColliders(); 
    }
    createBounds(){
        //  set camera bounds
        this.cameras.main.setBounds(0,0,totalWidth, config.height);
        //  set world bounds
        this.physics.world.setBounds(0,0,totalWidth,config.height);
        
    }
    createBackground(){
        //  adds sky image
        this.add.image(config.width/2, config.height/2, "sky")
            .setScrollFactor(0);
        //  create parallax background
        this.alignBackground(this, "mountains", 0.25);
        this.alignBackground(this, "fields", 0.5);
        this.alignBackground(this, "floor", 1);
    }
    // allignBackground code is from Ourcade on Youtube
    alignBackground(scene, texture, scrollFactor){
        //  creates image width variable
        const imgWidth = scene.textures.get(texture).getSourceImage().width;
        //  count is how many images can fit within the total width of the game
        const count = Math.ceil(totalWidth/imgWidth) * scrollFactor;

        let x = 0;
        //  loop count number of times so there is enough images to repeat across the whole game
        for(let i=0; i < count; i++){
            //  add image
            scene.add.image(x, config.height, texture)
            .setOrigin(0, 1)
            .setScrollFactor(scrollFactor);
            //  change x so next image is placed next to last one
            x += imgWidth;
        }
    }
    buildWorld(scene, world) {
        //  adds a new tilemap under map variable
        world.map = scene.make.tilemap({key:"map"});
        //  adds a tileset to the map
        world.mainTileset = world.map.addTilesetImage("MainTileSet", "mainTiles", 32, 32, 1, 2);
        //  make the tileset into the groundlayer and make it immovable
        world.groundLayer = world.map.createStaticLayer("groundLayer",world.mainTileset,0,0)
        //  allow for collision across the map
        world.map.setCollisionBetween(1, 999, true, "groundLayer");
    } 
    createStartFinish(){
        //  adds startline
        this.add.image(160,config.height/1.48,"start");
        //  creates the finishline
        world.finishLine = new Finish(this,totalWidth-120,config.height/5.5,"finish");
    }
    createControls(){
        //  set up controls
        world.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        world.shootButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        world.cursors = this.input.keyboard.createCursorKeys();
    }
    createGameObjects(){
        //  spawn player
        world.player = new Player(this,config.width/4,config.height/2,"player");
        //  make groups
        world.waterGroup = this.add.group();
        world.fireGroup = this.add.group();
        world.projectileGroup = this.add.group();
        world.redFlameGroup = this.add.group();
        //  spawn water
        for(var i=0;i<20;i++){
            let water = new Water(this,Phaser.Math.Between(config.width/2,totalWidth),Phaser.Math.Between(0,config.height), "water");
            world.waterGroup.add(water);
        }
        //  spawn fire
        for(var i=0;i<10;i++){
            let fire = new Fire(this,Phaser.Math.Between(config.width/2,totalWidth),Phaser.Math.Between(0,config.height), "fire");
            world.fireGroup.add(fire);
        }
        //  spawn redFlames
        for(var i=0;i<20;i++){
            let redflame = new RedFlame(this,Phaser.Math.Between(config.width/2,totalWidth),Phaser.Math.Between(0,config.height), "redFlame");
            world.redFlameGroup.add(redflame);
        }
        //  makes the camera follow the player
        this.cameras.main.startFollow(world.player);
    }
    createAudio(){
        //  add music
        world.backgroundMusic = this.sound.add("backgroundMusic");
        var backgroundMusicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            loop: true
        }
        //  play music
        world.backgroundMusic.play(backgroundMusicConfig);
        //  add sound effects
        world.shootSFX = this.sound.add("shootSFX");
        world.pickupSFX = this.sound.add("pickupSFX");
        world.takeDamageSFX = this.sound.add("takeDamageSFX");
    }
    createText(){
        //  adds text to the scene
        pickupText = this.add.text();
        winText = this.add.text(totalWidth - config.width/2,config.height/2).setAlpha(0);  
    }
    showUI(){
        //  makes ui visible 
        livesInfo.setAlpha(1);
        bulletInfo.setAlpha(1);
        world.timerText.setAlpha(1);
    }
    createTimer(){
        //  timer 180 secs
        timerEvent = this.time.delayedCall(world.timerLength, world.player.loseGame, [], this)
    }
    createColliders(){
        //  adds colliders between game objects and the groundLayer
        this.physics.add.collider(world.player, world.groundLayer);
        this.physics.add.collider(world.waterGroup, world.groundLayer);
        this.physics.add.collider(world.finishLine, world.groundLayer); 
        this.physics.add.collider(world.fireGroup, world.groundLayer);
        this.physics.add.collider(world.projectileGroup,world.groundLayer);
        this.physics.add.collider(world.redFlameGroup,world.groundLayer);

        //  player takes damage when overlapped with water
        this.physics.add.overlap(world.player, world.waterGroup, world.player.damagePlayer);
        //  player picks up fire when overlapped
        this.physics.add.overlap(world.fireGroup, world.player , world.player.collectFire);
        //  player picks up red flames when overlapped
        this.physics.add.overlap(world.redFlameGroup, world.player , world.player.collectRedFlame);
        //  player wins game when overlapped with the finishline
        this.physics.add.overlap(world.player, world.finishLine, world.finishLine.winGame);
        //  adds colliders between the projectiles and waters and the groundlayer 
        this.physics.add.collider(world.projectileGroup, world.waterGroup, this.collideProjectileWater);
    }
    
    collideProjectileWater(projectile,water){
        //  destroy overlapping water and projectile
        water.destroy();
        projectile.destroy();
        //  workout where to display point text
        pickupText.x = water.x - world.TILEWIDTH;
        pickupText.y = water.y - (world.TILEWIDTH * 2);
        //  displays points text
        pickupText.setText("+" + water.waterPoints);
        //  adds 1000 to the kill score
        world.killScore += 1000;
    }
    //  UPDATE ******************************************************************************************************************************
    update(){
        //  run updatePlayer method
        world.player.updatePlayer();
        this.updateArrayObjects();
        //  updates the ongoing timer
        this.updateTimer();
    }
    updateArrayObjects(){
        //  create an array to hold each of the groups children
        var water_ary = world.waterGroup.getChildren();
        var fire_ary = world.fireGroup.getChildren();
        var projectile_ary = world.projectileGroup.getChildren();
        var redFlame_ary = world.redFlameGroup.getChildren();
        //  update each child in all of the arrays
        for (let water_spr of water_ary){
            water_spr.updateWater();
        }
        for (let fire_spr of fire_ary){
            fire_spr.updateFire();
        }
        for (let projectile_spr of projectile_ary){
            projectile_spr.updateProjectile();
        }
        for (let redFlame_spr of redFlame_ary){
            redFlame_spr.updateRedFlame();
        }
    }
    updateTimer(){
        //  calculates the percentage of time left
        var antiprogress = 1 - timerEvent.getProgress().toString();
        //  rounds the time to a whole number and multply by 20,000 to get the time score
        world.timeScore = Phaser.Math.FloorTo(antiprogress * 20000);
        var timeSecs = Phaser.Math.FloorTo(antiprogress*(world.timerLength/1000));
        world.timerText.setText("Time Left: " + timeSecs  + " Seconds");
    }
}
var config = {
    type: Phaser.AUTO,
    width: world.COLUMNS * world.TILEWIDTH,
    height: world.ROWS * world.TILEWIDTH,
    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: {
            tileBias: 40,
            gravity:{y:4000, x:0},
            debug: false
        }
    },
    scene: [PreloadScene,GameScene,UIScene,LoseScene]
};
const jumpSpeed = 1000; 

const totalWidth = config.width * 10;

var timerEvent;
var winText;
var pickupText;
var livesInfo;
var bulletInfo;
var jumpCount = 0;

let game = new Phaser.Game(config);     