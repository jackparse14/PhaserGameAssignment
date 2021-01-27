class UIScene extends Phaser.Scene {
    constructor(){
        super({key:'UIScene',active:true})
    }
    create(){
        //  adds text for the ui
        world.timerText = this.add.text(10,10).setAlpha(0);
        livesInfo = this.add.text(10,30,"Lives: 3").setAlpha(0);
        bulletInfo = this.add.text(10,50,"Fire Bullets: 1").setAlpha(0);
        
    }
}