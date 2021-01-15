class UIScene extends Phaser.Scene {
    constructor(){
        super({key:'UIScene',active:true})
    }
    create(){
        livesInfo = this.add.text(10,10,'Lives: 3').setAlpha(0);
        bulletInfo = this.add.text(10,30,'Fire Bullets: 1').setAlpha(0);
    }
}