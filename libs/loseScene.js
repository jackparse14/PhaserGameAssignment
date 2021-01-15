class LoseScene extends Phaser.Scene {
    constructor(){
        super({key:'lose'})
    }

    preload(){
        //  loads lose scene image
        this.load.image("loseScene","./assets/Images/loseScene.png");
    }

    create(){   
        //  adds lose scene image
        this.add.image(config.width/2,config.height/2,"loseScene");
    }
}