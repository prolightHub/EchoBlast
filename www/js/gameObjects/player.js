import game from "../game.js";

export default class Player {

    constructor (scene, x, y)
    {
        this.createSprite(scene, x, y);
    }
    
    createSprite (scene, x, y)
    {
        // Set player
        this.sprite = scene.physics.add.sprite(x, y, "player");
        this.sprite.setDrag(100, 0).setMaxVelocity(250, 600).setDrag(100, 20);
      
        this.sprite.setScale(2, 2);
        this.sprite.setOrigin(0, 0);

        this.keys = scene.input.keyboard.createCursorKeys();

        this.revive();
    }

    update (time, delta)
    {   
        if(this.dead)
        {
            return;
        }

        // Set up variables
        const [ keys, sprite ] = [this.keys, this.sprite];
        let speed = 1000;
        let jumpHeight = 490;

        // Move left or right
        if(keys.left.isDown) 
        {
            sprite.body.setAccelerationX(-speed).setDrag(230, 20);
            sprite.setFlipX(true);

			if(sprite.body.onFloor())
			{
				sprite.play('walk', true);
			}
        }
        else if(keys.right.isDown) 
        {
            sprite.body.setAccelerationX(speed).setDrag(230, 20);
            sprite.setFlipX(false);

			if(sprite.body.onFloor())
			{
				sprite.play('walk', true);
			}
        }else{
            sprite.setAccelerationX(0).setDrag(600, 20);

			// Only show the idle animation if the player is footed
			// If this is not included, the player would look 
			// idle while jumping
			if(sprite.body.onFloor())
			{
				sprite.play('idle', true);
			}
        }

        // Jump mechanics
        if((keys.space.isDown || keys.up.isDown) && sprite.body.onFloor())
        {
            sprite.body.setVelocityY(-jumpHeight);
        }

        if(sprite.y > levelHandler.blockLayer.height + sprite.height)
        {
            this.kill();
        }
    }

    onCollide (object, name, scene)
    {
        switch(name)
        {
            case "lava" :
                this.kill();
                break;

            case "door" :
                if(this.keys.down.isDown && this.sprite.body.onFloor())
                {
                    this.enteredDoor = true;
                    this.touchedObject = object;

                    this.sprite.body.stop();
                }
                break;

            case "saveBlock" :
                if(this.sprite.body.blocked.up)
                {
                    game.save(scene, this, object);
                }
                break;
        }
    }

    kill ()
    {
		this.sprite.play('idle', true);
        this.sprite.body.stop();
        this.dead = true;
    }

    revive () 
    {
        this.dead = false;
    }

    cleanState ()
    {
        this.sprite.destroy();
        this.enteredDoor = false;
        delete this.touchedObject;
        this.dead = false;
    }
}