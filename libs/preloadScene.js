class PreloadScene extends Phaser.Scene {
    constructor(){
        super({key:'preload'})
    }

    preload(){
        //  load start up scene
        this.load.image("startScene","./assets/Images/startScene.png");
    }

    create(){
        //  add start up scene
        this.add.image(config.width/2,config.height/2,"startScene");
        //  when the user clicks the game scene will start
        this.input.on('pointerdown', () => this.scene.start('game'));
    }
}