let world = {
    ROWS: 20,
    COLUMNS: 20,
    TILEWIDTH: 32,
    cursors: null,
    jumpButton: null,
    map: null,
    player: null,
    health: 3,
    water: null,
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
    this.load.image("mainTiles","./assets/Tilesets/MainTileSheet.png");
    this.load.image("start","./assets/Images/Start.png");

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
    this.cameras.main.setBounds(0,0,totalWidth, config.height);
    
    this.physics.world.setBounds(0,0,totalWidth,config.height);

    this.add.image(config.width/2, config.height/2, "sky")
        .setScrollFactor(0);

    allignBackground(this, "mountains", 0.25);
    allignBackground(this, "fields", 0.5);
    allignBackground(this, "floor", 1);
    buildWorld(this,world);

    this.add.image(160,config.height/1.48,"start")
    
    world.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    world.cursors = this.input.keyboard.createCursorKeys();
    
    world.player = new Player(this,config.width/4,config.height/2,"player");
    //add water to a group to spawn lots
    
    world.water =  new Water(this,config.width/1.5,config.height/4,"water");

    text = this.add.text(32,32);    
    timerEvent = this.time.delayedCall(6000, endGame, [], this)

    this.cameras.main.startFollow(world.player);

    this.physics.add.collider(world.player, world.groundLayer);
    this.physics.add.collider(world.water, world.groundLayer);
    this.physics.add.overlap(world.player,world.water,world.player.damagePlayer, null, this)

}

function update(time,delta){
    world.player.updatePlayer(); 
    world.water.updateWater();
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
    
    world.mainTileset = world.map.addTilesetImage("MainTileSet", "mainTiles");

    world.groundLayer = world.map.createStaticLayer("groundLayer",world.mainTileset,0,0)

    world.map.setCollisionBetween(1, 999, true, "groundLayer");
} 

function updateTimer(){
    var progress = timerEvent.getProgress().toString();
    var antiprogress = 1 - progress;
    text.setText(antiprogress*100);;
}

function endGame(){
    console.log("poop");
}

let game = new Phaser.Game(config); 