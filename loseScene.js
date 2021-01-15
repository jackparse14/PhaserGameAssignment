class LoseScene extends Phaser.Scene {
    constructor(){
        super({key:'lose'})
    }

    preload(){
        this.load.image("loseScene","./assets/Images/loseScene.png");
    }

    create(){   
        this.add.image(config.width/2,config.height/2,"loseScene");
    }
}