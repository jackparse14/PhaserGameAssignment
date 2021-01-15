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
    takeDamageSFX: null
};

class GameScene extends Phaser.Scene{
    constructor(){
        super({key:"game"})
    }

    preload (){
        //  loads all images
        this.load.image("sky", "./assets/Images/sky.png");  
        this.load.image("mountains","./assets/Images/mountains.png");
        this.load.image("fields","./assets/Images/fields.png");
        this.load.image("floor","./assets/Images/Pillars.png");
        this.load.image("mainTiles","./assets/Tilesets/MainTileSheet_Extruded.png");
        this.load.image("start","./assets/Images/start.png");
        this.load.image("finish","./assets/Images/Finish.png");

        //  loads tilemap
        this.load.tilemapTiledJSON("map", "./assets/Tilemaps/map.json");

        //  loads spritesheets
        this.load.spritesheet("player","./assets/Sprites/FlameCharacter-Spritesheet.png", {
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

        //  loads audio
        this.load.audio("backgroundMusic",["./assets/Audio/mainBackgroundAudio.mp3"]);
        this.load.audio("shootSFX",["./assets/Audio/shoot.mp3"]);
        this.load.audio("takeDamageSFX",["./assets/Audio/takeDamage.mp3"]);
        this.load.audio("pickupSFX",["./assets/Audio/pickup.mp3"]);
    }

    create (){
        //  set camera bounds
        this.cameras.main.setBounds(0,0,totalWidth, config.height);
        //  set world bounds
        this.physics.world.setBounds(0,0,totalWidth,config.height);
        //  adds sky image
        this.add.image(config.width/2, config.height/2, "sky")
            .setScrollFactor(0);
        //  create parallax background
        this.allignBackground(this, "mountains", 0.25);
        this.allignBackground(this, "fields", 0.5);
        this.allignBackground(this, "floor", 1);
        //  runs buildworld
        this.buildWorld(this,world);
        //  adds startline
        this.add.image(160,config.height/1.48,"start");
        //  creates the finishline
        world.finishLine = new Finish(this,totalWidth-120,config.height/5.5,"finish");
        
        //  set up controls
        world.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        world.shootButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        world.cursors = this.input.keyboard.createCursorKeys();
        
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
        

        //  add text
        pointsText = this.add.text();
        loseText = this.add.text();
        winText = this.add.text(totalWidth - config.width/2,config.height/2).setAlpha(0);  
        //  makes ui visible 
        livesInfo.setAlpha(1);
        bulletInfo.setAlpha(1);
        //  timer 180 secs
        timerEvent = this.time.delayedCall(180000, world.player.loseGame, [], this)
        //  makes the camera follow the player
        this.cameras.main.startFollow(world.player);

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
        this.physics.add.collider(world.projectileGroup, world.groundLayer, this.collideProjectileGround);
    }

    update(){
        //  create array variables for all groups
        var water_ary;
        var fire_ary;
        var projectile_ary;
        var redFlame_ary;

        //  run updatePlayer method
        world.player.updatePlayer(); 

        //  make each array hold the groups children
        water_ary = world.waterGroup.getChildren();
        fire_ary = world.fireGroup.getChildren();
        projectile_ary = world.projectileGroup.getChildren();
        redFlame_ary = world.redFlameGroup.getChildren();

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

        //  updates the ongoing timer
        this.updateTimer();
    }

    allignBackground(scene, texture, scrollFactor){
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

    updateTimer(){
        //  calculates the percentage of time left
        var antiprogress = 1 - timerEvent.getProgress().toString();
        //  rounds the time to a whole number and multply by 20,000 to get the time score
        world.timeScore = Phaser.Math.FloorTo(antiprogress * 20000);
    }

    collideProjectileGround(projectile,groundLayer){
        //  destroy overlapping projectile
        projectile.destroy();
    }
    collideProjectileWater(projectile,water){
        //  destroy overlapping water and projectile
        water.destroy();
        projectile.destroy();
        //  workout where to display point text
        pointsText.x = water.x - world.TILEWIDTH;
        pointsText.y = water.y - (world.TILEWIDTH * 2);
        //  displays points text
        pointsText.setText("+" + water.waterPoints);
        //  adds 1000 to the kill score
        world.killScore += 1000;
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
            gravity:{y:6000, x:0},
            debug: false
        }
    },
    scene: [PreloadScene,GameScene,UIScene,LoseScene]
};
const jumpSpeed = 1000; 
const moveSpeed = 250;
const totalWidth = config.width * 10;

var timerEvent;
var winText;
var loseText;
var pointsText;
var livesInfo;
var bulletInfo;
var jumpCount = 0;

let game = new Phaser.Game(config);     