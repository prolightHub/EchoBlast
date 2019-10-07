import game from "../game.js";

var buttons = createButtons();


export default class MainScene extends Phaser.Scene {

    constructor ()
    {
        super('mainScene');
    }

    preload ()
    {
        
    }

    create ()
    {
        game.init(this);

        this.add.text(400, 134, 'EchoBlast', 
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '40px',
        })
        .setOrigin(0.5, 0.5);

        this.graphics = this.add.graphics({});

        buttons.play = new Button(this, 400, 240, 120, 40, new Phaser.Display.Color(0, 140, 40), "Play", 
        {
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'center',
            fontFamily: '"Press Start 2P"'
        }, 
        function()
        {
            if(this.cutScening)
            {
                return;
            }
            
            this.scene.get("fxScene").fadeOut(500, () =>
            {
                game.start(this);

                this.cutScening = false;
            });
            
            this.cutScening = true;
        }, {
            offsetX: 0.7
        });

        this.input.on('pointerdown', function (pointer) 
        {
            buttons.onpointerdown.apply(this, arguments); 
        }, 
        this);

        this.cameras.main.fadeIn(500, 0);
    }

    update ()
    {
        buttons.draw(this.graphics);
    }

    render ()
    {

    }
}