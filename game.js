let world = {
    ROWS: 20,
    COLUMNS: 20,
    TILEWIDTH: 32,
    cursors: null,
    jumpButton: null,
    shootButton: null,
    map: null,
    player: null,
    finishLine: null,
    health: 3,
    currentProjectiles: 1,
    projectileGroup: null,
    waterGroup: null,
    fireGroup: null,
    mainTileset: null,
    groundLayer: null
};

let config = {
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
    scene:{
        preload: preload,
        create: create,
        update: update  
    }
};



const jumpSpeed = 1000; 
const moveSpeed = 250;
const totalWidth = config.width * 10;

var timerEvent;
var text;
var jumpCount = 0;

function preload (){
    this.load.image("sky", "./assets/Images/sky.png");  
    this.load.image("mountains","./assets/Images/mountains.png");
    this.load.image("fields","./assets/Images/fields.png");
    this.load.image("floor","./assets/Images/Pillars.png");
    this.load.image("mainTiles","./assets/Tilesets/MainTileSheet_Extruded.png");
    this.load.image("start","./assets/Images/start.png");
    this.load.image("finish","./assets/Images/Finish.png");

    this.load.tilemapTiledJSON("map", "./assets/Tilemaps/map.json");

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
}

function create (){
    //set camera bounds
    this.cameras.main.setBounds(0,0,totalWidth, config.height);
    //set world bounds
    this.physics.world.setBounds(0,0,totalWidth,config.height);
    //adds sky
    this.add.image(config.width/2, config.height/2, "sky")
        .setScrollFactor(0);
    //create parallax background
    allignBackground(this, "mountains", 0.25);
    allignBackground(this, "fields", 0.5);
    allignBackground(this, "floor", 1);
    //build
    buildWorld(this,world);

    this.add.image(160,config.height/1.48,"start");
    world.finishLine = new Finish(this,totalWidth-120,config.height/5.5,"finish");
    
    //set up controls
    world.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    world.shootButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    world.cursors = this.input.keyboard.createCursorKeys();
    
    //spawn playr
    world.player = new Player(this,config.width/4,config.height/2,"player");

    //make groups
    world.waterGroup = this.add.group();
    world.fireGroup = this.add.group();
    world.projectileGroup = this.add.group();

    //spawn water
    world.waterGroup.add(new Water(this,config.width/1.5,config.height/4, "water"));
    world.waterGroup.add(new Water(this,config.width/2,config.height/3, "water"));


    //spawn fire
    world.fireGroup.add(new Fire(this,config.width/1.5,config.height/1.4, "fire"));
    world.fireGroup.add(new Fire(this,config.width/1.3,config.height/1.4, "fire"));


    text = this.add.text(totalWidth - config.width/2,config.height/2);    
    timerEvent = this.time.delayedCall(100000, world.player.loseGame, [], this)

    this.cameras.main.startFollow(world.player);

    this.physics.add.collider(world.player, world.groundLayer);
    this.physics.add.collider(world.waterGroup, world.groundLayer);
    this.physics.add.collider(world.finishLine, world.groundLayer); 
    this.physics.add.collider(world.fireGroup, world.groundLayer);

    this.physics.add.overlap(world.player, world.waterGroup, world.player.damagePlayer);
    this.physics.add.overlap(world.fireGroup, world.player , world.player.collectFire);
    this.physics.add.overlap(world.player, world.finishLine, world.finishLine.winGame);
    this.physics.add.overlap(world.projectileGroup, world.waterGroup, destroyGameObject);
    this.physics.add.overlap(world.projectileGroup, world.groundLayer, destroyGameObject);
}

function update(){
    var water_ary;
    var fire_ary;
    var projectile_ary;

    world.player.updatePlayer(); 

    water_ary = world.waterGroup.getChildren();
    fire_ary = world.fireGroup.getChildren();
    projectile_ary = world.projectileGroup.getChildren();

    for (let water_spr of water_ary){
        water_spr.updateWater();
    }
    for (let fire_spr of fire_ary){
        fire_spr.updateFire();
    }
    for (let projectile_spr of projectile_ary){
        projectile_spr.updateProjectile();
    }

    updateTimer();
}

function allignBackground(scene, texture, scrollFactor){
    const imgWidth = scene.textures.get(texture).getSourceImage().width;

    const count = Math.ceil(totalWidth/imgWidth) * scrollFactor;

    let x = 0;
    for(let i=0; i < count; i++){
        scene.add.image(x, config.height, texture)
        .setOrigin(0, 1)
        .setScrollFactor(scrollFactor);

        x += imgWidth;
    }
}
    
function buildWorld(scene, world) {
    world.map = scene.make.tilemap({key:"map"});
    
    world.mainTileset = world.map.addTilesetImage("MainTileSet", "mainTiles", 32, 32, 1, 2);

    world.groundLayer = world.map.createStaticLayer("groundLayer",world.mainTileset,0,0)

    world.map.setCollisionBetween(1, 999, true, "groundLayer");
} 

function updateTimer(){
    var progress = timerEvent.getProgress().toString();
    var antiprogress = 1 - progress;    
    text.setText("You Win - Score: " + antiprogress*100);
}

function destroyGameObject(){
    projectile.destroy();
}
let game = new Phaser.Game(config);     