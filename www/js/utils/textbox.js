export default class TextBox {

    constructor (scene, x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;   
        this.lastCursorShowTime = 0;

        this.text = scene.add.text(x + 13, y + height / 2, "", 
        {
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'center',
        })
        .setOrigin(0, 0.5);

        this.longestLength = width / 14 - 1;
    }

    updateText(event)
    {
        var text = this.text.text.replace("|", "");

        if(event.key === "Backspace" && text.length >= 0)
        {
            this.text.setText(text.slice(0, -1));
        }
        else if(event.key.length <= 1 && text.length < this.longestLength)
        {
            this.text.setText(text + event.key);
        }
    }

    draw (scene, graphics)
    {
        graphics.fillStyle(0x000000);
        graphics.fillRect(this.x, this.y, this.width, this.height);
    }

    update (scene, time)
    {
        if(time - this.lastCursorShowTime > 500)
        {
            if(this.text.text.indexOf("|") === -1)
            {
                this.text.setText(this.text.text + "|");
            }else{
                this.text.setText(this.text.text.replace("|", ""));
            }

            this.lastCursorShowTime = time;
        }
    }

    destroy ()
    {
        this.text.destroy();
    }
}

