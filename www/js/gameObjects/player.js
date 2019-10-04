export default class Player {

    constructor (scene, x, y)
    {
        // Set player
        this.sprite = scene.physics.add.sprite(x, y, "player");
        this.sprite.setDrag(100, 0).setMaxVelocity(250, 600).setDrag(100, 20);
      
        this.keys = scene.input.keyboard.createCursorKeys();
    }

    update (time, delta)
    {   
        // Set up variables
        const [ keys, sprite ] = [this.keys, this.sprite];
        let speed = 1000;
        let jumpHeight = 490;

        // Move left or right
        if(keys.left.isDown) 
        {
            sprite.body.setAccelerationX(-speed).setDrag(230, 20);
            sprite.setFlipX(true);
        }
        else if(keys.right.isDown) 
        {
            sprite.body.setAccelerationX(speed).setDrag(230, 20);
            sprite.setFlipX(false);
        }else{
            sprite.setAccelerationX(0).setDrag(600, 20);
        }

        // Jump mechanics
        if(keys.up.isDown && sprite.body.onFloor()) 
        {
            sprite.body.setVelocityY(-jumpHeight);
        }
    }
}