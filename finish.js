class Finish extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,texture){
        super(scene, x, y,texture);
        scene.physics.add.existing(this);
        scene.add.existing(this);
    }
    
    winGame(){
        //Display Win text
        winText.setText("YOU WIN! - Score: " + (world.timeScore + world.killScore + world.collectScore)).setAlpha(1);
        //pause the game
        game.scene.pause("game");
    }
}