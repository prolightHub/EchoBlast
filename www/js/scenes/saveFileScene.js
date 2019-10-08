import game from "../game.js";

export default class SaveFileScene extends Phaser.Scene {

    constructor ()
    {
        super("saveFileScene");
    }

    preload ()
    {
        
    }

    create ()
    {
        this.inputtingUsername = false;

        this.scene.get("fxScene").fadeIn(500);   
        
        this.graphics = this.add.graphics({});

        var rectColor = new Phaser.Display.Color(0, 0, 0, 100);

        this.graphics.fillStyle(rectColor, rectColor.alphaGL);
        this.graphics.fillRect(0, 0, 800, 480);

        var rectColor2 = new Phaser.Display.Color(0, 0, 0, 100);

        this.graphics.fillStyle(rectColor2, rectColor2.alphaGL);
        this.graphics.fillRect(0, 0, 800, 60);

        this.add.text(140, 20, 'Select a file', 
        {
            fill: '#FFFFFF',
            align: 'left',
            fontSize: '20px',
        });

        this.newSaveFiles = [];

        this.buttonGraphics = this.add.graphics({});

        var scene = this;

        this.newSaveFiles.add = function(text, x, y, width, height, color, onClick, onDraw)
        {
            this.push(new Button(scene, x + width / 2, y + height / 2, width, height, color, text, 
            {
                fontSize: '20px',
                fill: '#FFFFFFDD',
                align: 'center',
            }, 
            onClick, 
            {
                offsetX: 0.1,
                offsetY: 0.2
            }));

            this[this.length - 1].extraText = scene.add.text(x + width / 2, y + height / 2, "New!!", {
                fontSize: '20px',
                fill: '#FFFFFFDD',
                align: 'center'
            }).setOrigin(0.5, 0.5);

            this[this.length - 1].onDraw = onDraw || function() {};

            this[this.length - 1].state = "new";
        };
        this.newSaveFiles.draw = function()
        {
            for(var i = 0; i < this.length; i++)
            {
                this[i].draw(scene.buttonGraphics);
                this[i].onDraw(scene.buttonGraphics);
            }
        };

        var onClick = function()
        {
            switch(this.state)
            {
                case "new" :
                    
                    this.state = "used";
                    this.extraText.setText("");

                    scene.startInputUsername(this);
                    break;
            }
        };

        this.newSaveFiles.add("1", 140, 130, 245, 100, new Phaser.Display.Color(0, 0, 0, 100), onClick);
        this.newSaveFiles.add("2", 415, 130, 245, 100, new Phaser.Display.Color(0, 0, 0, 100), onClick);
        this.newSaveFiles.add("3", 140, 260, 245, 100, new Phaser.Display.Color(0, 0, 0, 100), onClick);
        this.newSaveFiles.add("4", 415, 260, 245, 100, new Phaser.Display.Color(0, 0, 0, 100), onClick);

        this.input.on('pointerdown', function (pointer) 
        {
            if(this.inputtingUsername)
            {
                if(pointer.x < 150 || pointer.x > 650)
                {
                    this.endInputUsername();
                }

                return;
            }

            for(var i = 0; i < this.newSaveFiles.length; i++)
            {
                if(this.newSaveFiles[i].isClicked(pointer.x, pointer.y))
                {
                    this.newSaveFiles[i].onClick(pointer.x, pointer.y);
                }
            }
        }, 
        this);

        this.UIGraphics = this.add.graphics({});

        this.UIText = this.add.text(400, 100, "", 
        {
            fontSize: '20px',
            fill: '#FFFFFFDD',
            align: 'center',
        })
        .setOrigin(0.5, 0.5);
    }

    update (time, delta)
    {
        this.buttonGraphics.clear();

        this.newSaveFiles.draw();
    }

    render ()
    {
        
    }

    endInputUsername ()
    {
        // Undo actions
        this.UIText.text = "";
        this.UIGraphics.clear();

        this.UINewSaveFile.state = "new";
        this.UINewSaveFile.extraText.setText("New!!");
        delete this.UINewSaveFile;

        this.inputtingUsername = false;
    }

    startInputUsername (newSaveFile)
    {
        var color = new Phaser.Display.Color(0, 80, 100, 100);

        this.UIGraphics.fillStyle(color, color.alphaGL);
        this.UIGraphics.fillRect(150, 0, 500, 480);
        this.UIText.setText("Type your name!");

        this.UINewSaveFile = newSaveFile;
        this.inputtingUsername = true;
    }
}