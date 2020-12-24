let world = {
    ROWS: 20,
    COLUMNS: 20,
    TILEWIDTH: 32,
    cursors: null,
    jumpButton: null,
    map: null,
    mainTileset: null,
    mainLayer: null
};

let config = {
    type: Phaser.AUTO,
    width: world.COLUMNS * world.TILEWIDTH,
    height: world.ROWS * world.TILEWIDTH,
    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y:0, x:0},
            debug: true
        }
    },
    scene:{
        preload: preload,
        create: create,
        update: update
    }
};



const jumpSpeed = 2000; 
const moveSpeed = 500;
const totalWidth = world.width * 10;


var jumpCount = 0;

function preload (){
    this.load.image("sky", "./assets/Images/sky.png");  
    this.load.image("mountains","./assets/Images/mountains.png");
    this.load.image("fields","./assets/Images/fields.png");
    this.load.image("floor","./assets/Images/floor.png");
    this.load.image("mainTiles","./assets/Tilesets/MainTileSheet.png");

    this.load.tilemapTiledJSON("map", "./assets/Tilemaps/map3.json");

    this.load.spritesheet("player","./assets/Sprites/MainCharacterIDLE-sheet.png", {
        frameWidth: 32,
        frameHeight: 32 
    });
}

function create (){
    buildWorld(this, world);
    world.mainLayer.setCollisionByProperty({collides:true});
    this.cameras.main.setBounds(0,0,totalWidth, world.height);
    
    this.physics.world.setBounds(0,0,totalWidth,world.height);

    this.add.image(world.width/2, world.height/2, "sky")
        .setScrollFactor(0);

    allignBackground(this, "mountains", 0.25);
    allignBackground(this, "fields", 0.5);
    allignBackground(this, "floor", 1);

    world.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    world.cursors = this.input.keyboard.createCursorKeys();
    
    world.player = new Player(this,world.width/4,world.height/2,"player");
    
    this.cameras.main.startFollow(world.player);

    this.physics.add.collider(world.player, world.mainLayer);
    
}

function update(time,delta){
    world.player.updatePlayer(); 
}

function allignBackground(scene, texture, scrollFactor){
    const imgWidth = scene.textures.get(texture).getSourceImage().width;

    const count = Math.ceil(totalWidth/imgWidth) * scrollFactor;

    let x = 0;
    for(let i=0; i < count; i++){
        scene.add.image(x, world.height, texture)
        .setOrigin(0, 1)
        .setScrollFactor(scrollFactor);

        x += imgWidth;
    }
}

function buildWorld(scene, world) {
    world.map = scene.make.tilemap({key:"map"});
    
    world.mainTileset = world.map.addTilesetImage("MainTileSheet", "mainTiles");

    world.mainLayer = world.map.createStaticLayer("main",world.mainTileset,0,0);
} 


let game = new Phaser.Game(config); 