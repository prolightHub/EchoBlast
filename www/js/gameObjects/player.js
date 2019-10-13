import game from "../game.js";

export default class Player {

    constructor (scene, x, y)
    {
        this.createSprite(scene, x, y, true);
    }
    
    createSprite (scene, x, y, revive)
    {
        // Set player
        this.sprite = scene.physics.add.sprite(x, y, "player");
        this.sprite.setDrag(100, 0).setMaxVelocity(250, 600).setDrag(100, 20);
      
        this.sprite.setScale(2, 2);
        this.sprite.setOrigin(0, 0);
        this.sprite.setOffset(-1.5, 0);
        
        scene.physics.add.collider(this.sprite, levelHandler.blockLayer);
        scene.physics.add.collider(this.sprite, levelHandler.itemsLayer);

        this.keys = scene.input.keyboard.createCursorKeys();

        if(revive)
        {
            this.maxHp = 12;
            this.hp = 12;

            this.revive();
        }
        
		scene.anims.create({
            key : 'idle', 
            frames : scene.anims.generateFrameNames('player', 
            {
                prefix : '000', 
                start : 0, 
                end : 0, 
            }), 
            frameRate : 0, 
            repeat : 0
        });
		scene.anims.create({
            key : 'walk', 
            frames : scene.anims.generateFrameNames('player', 
            {
                prefix : '000', 
                start : 0, 
                end : 3, 
            }),
            frameRate : 10, 
            repeat : -1
		});

        // Set up collision with the player for the walls and tiles
        this.sprite.body.setCollideWorldBounds(true);

        this.lastHurtTime = 100;
        this.hurtInterval = 1000;

        this.lastBlinkTime = 0;
        this.blinkInterval = 100;
    }

    update (time, delta)
    {   
        if(this.dead)
        {
            return;
        }

        if(time - this.lastHurtTime < this.hurtInterval)
        {
            if(time - this.lastBlinkTime >= this.blinkInterval)
            {
                this.sprite.setVisible(!this.sprite._visible);

                this.lastBlinkTime = time;
            }
        }else{
            this.sprite.setVisible(true);
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

    updateHearts (scene)
    {
        if(this.hearts)
        {
            this.hearts.destroy(true);
        }

        this.hearts = scene.add.group();

        var heartsInt = this.hp / 4;

        for(var i = 0; i < heartsInt; i++)
        {
            var name = "heart4";

            if(i >= heartsInt - 1)
            {
                name = "heart" + (this.hp % 4 || 4);
            }

            this.hearts.create(30 + i * 40, 30, name).setScale(1.4, 1.4).setScrollFactor(0);
        }
    }

    takeHit (amt, time, scene)
    {
        if(time - this.lastHurtTime >= this.hurtInterval)
        {
            this.hp -= amt;
            this.updateHearts(scene);

            if(this.hp <= 0)
            {
                this.kill();
            }

            this.lastHurtTime = time;
        }
    }

    onCollide (object, name, scene)
    {
        switch(name)
        {
            case "lava" :
                this.takeHit(1, scene.time.now, scene);
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

            case "heart" :
                this.hp += 4;
                this.hp = Math.min(this.hp, this.maxHp);

                this.updateHearts(scene);

                levelHandler.itemsLayer.removeTileAt(object.x, object.y);
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