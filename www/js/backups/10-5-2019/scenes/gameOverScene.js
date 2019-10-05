import Player from "../gameObjects/player.js";

var levelHandler = {};

export default class GameOverScene extends Phaser.Scene {

    constructor ()
    {
        super('gameOverScene');
    }

    preload ()
    {
        
    }

    create ()
    {
        this.add.text(400, 124, 'Game Over!', 
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '40px',
        })
        .setOrigin(0.5, 0.5);

        this.add.text(400, 300, 'Click to retry', 
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '16px',
        })
        .setOrigin(0.5, 0.5);

        this.input.on("pointerdown", function(pointer) 
        {
            this.scene.get("fxScene").fadeIO(1000, () =>
            {
                this.scene.start("mainScene");
            });
        }, 
        this);
    }

    update ()
    {
        
    }

    render ()
    {
        
    }
}