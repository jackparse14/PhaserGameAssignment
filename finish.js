class Finish extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene, x, y,texture);
        scene.physics.add.existing(this);
        scene.add.existing(this);
    }
    
    winGame(){
        //make the win text visible
        text.setAlpha(1);
        //pause the game
        game.scene.pause("default");
    }
}