import Player from "../gameObjects/player.js";
import game from "../game.js";

export default class PlayScene extends Phaser.Scene {

    constructor ()
    {
        super('playScene');
    }

    preload ()
    {
        if((!this.player || this.player.dead) && game.storedSaveData)
        {
            levelHandler.travelType = "saveBlock";
            levelHandler.levelName = game.storedSaveData.levelName;
        }

        // This is probably not the way this was intended to use but okay.
        this.load.tilemapTiledJSON(levelHandler.levelName, "assets/tilemaps/" + levelHandler.levelName + ".json");

		this.load.spritesheet("otherTiles-extruded", "assets/tilesets/otherTiles-extruded.png", 
		{ 
			frameWidth: 32, 
			frameHeight: 32 
		});

		// Load player animations from the player spritesheet & atlas JSON
		this.load.atlas('player', 'assets/spritesheets/png/mario.png', 'assets/spritesheets/png/mario.json');
    }

    create ()
    {
        // Setup up the tilemap level, get the tile image, create a dynamic layer and set collsion
        levelHandler.level = this.make.tilemap({ key: levelHandler.levelName });
        levelHandler.otherTiles = levelHandler.level.addTilesetImage("otherTiles-extruded", "otherTiles-extruded");
        levelHandler.blockLayer = levelHandler.level.createDynamicLayer("World", [levelHandler.otherTiles], 0, 0);
        levelHandler.blockLayer.setCollisionByExclusion([-1, TILES.LAVA, TILES.DOORUP, TILES.DOORDOWN]);

        let spawnPoint = {};
        switch(levelHandler.travelType)
        {
            case "spawnPoint" :
                    // Find player spawn point and place him there
                    spawnPoint = levelHandler.level.findObject("Objects", obj => obj.name === "Player Spawn Point");
                    levelHandler.lastSpawnPointLevel = levelHandler.levelName;
                break;

            case "saveBlock" :
                // We used a save block.
                spawnPoint = levelHandler.level.findObject("Objects", obj => obj.name === game.storedSaveData.saveBlock.name);
                spawnPoint.y += 32;
                break;

            case "door" :
                    // Find corresponding door and place him there.
                    levelHandler.level.findObject("Objects", obj => 
                    {    
                        // We found a match
                        if(obj.type === "door" && obj.name.replace("Door", "").replace("door", "") === levelHandler.doorSymbol)
                        {
                            spawnPoint.x = obj.x;
                            spawnPoint.y = obj.y + 32;
                        }
                    });
                break;
        }

        if(!this.player)
        {
            this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        }else{
            this.player.cleanState();
            this.player.createSprite(this, spawnPoint.x, spawnPoint.y);
        }

        // Set up collision with the player for the walls and tiles
        this.player.sprite.body.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, levelHandler.level.widthInPixels, levelHandler.level.heightInPixels, true, true, true, false);
        this.physics.add.collider(this.player.sprite, levelHandler.blockLayer);

        // Have the camera start following the player and set the camera's bounds
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, levelHandler.level.widthInPixels, levelHandler.level.heightInPixels);

		this.anims.create({
            key : 'idle', 
            frames : this.anims.generateFrameNames('player', 
            {
                prefix : '000', 
                start : 0, 
                end : 0, 
            }), 
            frameRate : 0, 
            repeat : 0
        });
		this.anims.create({
            key : 'walk', 
            frames : this.anims.generateFrameNames('player', 
            {
                prefix : '000', 
                start : 0, 
                end : 3, 
            }),

            frameRate : 10, 
            repeat : -1
		});

        // Set collision
        // I should probably start making es6 classes for tiles
        levelHandler.blockLayer.setTileIndexCallback(TILES.LAVA, function(objectA, objectB)
        {
            this.player.onCollide.apply(this.player, [objectB, "lava"]);
        }, this);

        levelHandler.level.findObject("Objects", obj => 
        {    
            if(obj.type === "saveBlock")
            {
                var object = this.physics.add.sprite(obj.x - 3, obj.y - 3, "saveBlock").setOrigin(0, 0).setDepth(-1);

                object.body.setSize(obj.width + 6, obj.height + 10);
                object.body.moves = false;
                object.setVisible(false);
                object.obj = obj;

                this.physics.add.overlap(this.player.sprite, object, function(objectA, objectB)
                {
                    this.player.onCollide.apply(this.player, [objectB, "saveBlock", this]);
                }, 
                null, this);
            }
            else if(obj.type === "door")
            {
                var object = this.physics.add.sprite(obj.x, obj.y, "door").setOrigin(0, 0).setDepth(-1);

                object.body.setSize(obj.width, obj.height);
                object.body.moves = false;
                object.setVisible(false);
                object.obj = obj;

                this.physics.add.overlap(this.player.sprite, object, function(objectA, objectB)
                {
                    this.player.onCollide.apply(this.player, [objectB, "door", this]);
                }, 
                null, this);
            }
        });

        this.isGameBusy = false;
    }

    update ()
    {
        if(this.isGameBusy)
        {
            return;
        }

        this.player.update();

        if(this.player.dead)
        {
            this.isGameBusy = true;
            game.gameOver(this);
        }
        if(this.player.enteredDoor)
        {
            this.isGameBusy = true;
            game.onDoor(this);
        }
    }

    render ()
    {
        
    }
}