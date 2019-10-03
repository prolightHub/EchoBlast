export default class Player {

    constructor (scene, x, y)
    {
        this.sprite = scene.physics.add.sprite(x, y, "player");

        this.sprite.setDrag(100, 0).setMaxVelocity(250, 600).setDrag(100, 20);
      
        this.keys = scene.input.keyboard.createCursorKeys();
    }

    update (time, delta)
    {   
        
    }
}