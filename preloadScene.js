class PreloadScene extends Phaser.Scene {
    constructor(){
        super({key:'preload'})
    }

    preload(){
        this.load.image("startScene","./assets/Images/startScene.png");
    }

    create(){
        this.add.image(config.width/2,config.height/2,"startScene");
        this.input.on('pointerdown', () => this.scene.start('game'));
    }
}