class Finish extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene, x, y,texture);
        scene.physics.add.existing(this);
        scene.add.existing(this);
    }
    
    winGame(){
        console.log("Game Won");
        game.scene.pause("default");
    }
}