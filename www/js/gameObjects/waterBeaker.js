import game from "../game.js";

export default class WaterBeaker {

    constructor (scene, x, y)
    {
        this.sprite = scene.physics.add.sprite(x, y, "waterBeaker");  
        
        this.sprite.enableBody = true;
        this.sprite.setSize(32, 32);
        // this.sprite.setDrag(100, 0).setMaxVelocity(250, 600).setDrag(100, 20);
    
        scene.physics.add.collider(this.sprite, levelHandler.blockLayer);

        this.sprite.body.setCollideWorldBounds(true);
    }

    update (time, delta)
    {   
        const sprite = this.sprite;
        const speed = 760;

        // sprite.body.setAccelerationX(speed);
    }
}