export {
    Game,
    Character
}

const arrow = document.querySelector('.arrow');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main Class Object that controls the game's graphical operations as well as store player data.
class Game {
    constructor(){
        this.self = document.getElementById("game_canvas");
        this.ctx = this.self.getContext('2d')
        this.player = new Character()
    }
    get width(){return this.self.width}
    set width(value){this.self.width = value}
    get height(){return this.self.height}
    set height(value){this.self.height = value}

    isGameOver(){
        return this.player.isDead()
    }

    formatString(string, fontSize){
        const words = string.split(" ")
        let line = ""
        let lineSize = 0
        let lineNum = 1
        let boxWidth = this.width/1.2
        let lines = []
        for(let i =0; i < words.length;i++){
            let size = words[i].length * (fontSize/2.1)
            if(lineSize + size < boxWidth){
                line += words[i]+" "
                lineSize += size+fontSize/2.1
            }
            else{
                console.log(line)
                lines.push(line)
                line = ""
                lineSize = 0
                lineNum += 1

                line += words[i]+" "
                lineSize += size+fontSize/2.1
            }
        }
        lines.push(line)
        return lines
    }

    async newFrame(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'rgb(50, 50, 50)'
        this.ctx.fillRect(0,0, this.width, this.height)
        this.ctx.fillStyle = 'rgb(100, 100, 100)'
        this.ctx.fillRect((this.width-this.width/1.2)/2,(this.height-this.height/1.2)/2, this.width/1.2,this.height/1.2)
    }

    async postFrame(){
        // HP
        this.ctx.fillStyle = 'rgb(0, 0, 0)'
        this.ctx.fillRect(
            (this.width-this.width/1.2)/2-2,
            this.height/6-2, 
            84, 
            34)
        this.ctx.fillStyle = 'rgb(245, 50, 50)'
        this.ctx.fillRect(
            (this.width-this.width/1.2)/2,
            this.height/6, 
            80*(this.player.HP/this.player.MAX_HP), 
            30)
        this.ctx.fillStyle = 'rgb(255, 90, 90)'
        this.ctx.fillRect(
            (this.width-this.width/1.2)/2,
            this.height/6, 
            80*(this.player.HP/this.player.MAX_HP), 
            4)
        this.ctx.fillStyle = 'rgb(190, 50, 50)'
        this.ctx.fillRect(
            (this.width-this.width/1.2)/2,
            this.height/6+20, 
            80*(this.player.HP/this.player.MAX_HP), 
            10)
        // MP
        this.ctx.fillStyle = 'rgb(0, 0, 0)'
        this.ctx.fillRect(
            this.width - 82 - (this.width-this.width/1.2)/2,
            this.height/6-2, 
            84, 
            34)
        this.ctx.fillStyle = 'rgb(50, 50, 220)'
        this.ctx.fillRect(
            this.width - 80 - (this.width-this.width/1.2)/2,
            this.height/6, 
            80*(this.player.MP/this.player.MAX_MP), 
            30)
        this.ctx.fillStyle = 'rgb(90, 90, 255)'
        this.ctx.fillRect(
            this.width - 80 - (this.width-this.width/1.2)/2,
            this.height/6, 
            80*(this.player.MP/this.player.MAX_MP), 
            4)
        this.ctx.fillStyle = 'rgb(50, 50, 140)'
        this.ctx.fillRect(
            this.width - 80 - (this.width-this.width/1.2)/2,
            this.height/6+20, 
            80*(this.player.MP/this.player.MAX_MP), 
            10)
    }

    async postMsg(string, fontSize, wait=false, speed=20){
        this.newFrame()
        let boxWidth = this.width/1.2
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(
            (this.width-boxWidth)/2,
            this.height-this.height/4,
            boxWidth,
            this.height/4
        )
        this.postFrame()
        await this.drawTextLine(string, fontSize, boxWidth, speed)
        if(!wait){
            return
        }
        return new Promise((resolve)=>{

            const handleEnter = (e)=>{
                if(e.key == 'Enter' || e.key == "Space"){
                    arrow.style.display = 'none';
                    this.self.removeEventListener("keydown", handleEnter)
                    resolve(true)
                }
            }
            arrow.style.display = 'block';
            this.self.addEventListener("keydown", handleEnter)
        })
    }

    async drawTextLine(text, fontSize, boxWidth, speed=20){
        this.ctx.fillStyle = 'white'
        this.ctx.font = `${fontSize}px Calbri`
        let pos = 0
        let width = 0
        const leftPadding = (this.width-boxWidth)/2
        this.ctx.textAlign = "left"
        for(let i = 0; i < text.length; i++){
            const character = text[i]
            let charWidth = this.ctx.measureText(character).width
            if (4+width+charWidth > boxWidth){
                pos+=fontSize
                width = 0
                let newText = `-${character}`
                charWidth = this.ctx.measureText(newText).width
                this.ctx.fillText(
                    newText,
                    leftPadding+width,
                    this.height-this.height/4+fontSize-2+pos
                )
                width += charWidth
            }
            else{
                this.ctx.fillText(
                    character,
                    leftPadding+width,
                    this.height-this.height/4+fontSize-2+pos
                )
                width += charWidth
            }
            await delay(speed)
        }
    }

    async drawOptions(options){
        const numOptions = options.length
        console.log(numOptions)
                return new Promise((resolve)=>{
                    const Obj = this
                    let buttons = []
                    for(let i = 0; i < options.length;i++){
                        const buttonProp = this.drawButton(options[i], i+1, i*50)
                        buttons.push(buttonProp)
                    }

                    function handleClick(e){
                        const rect = Obj.self.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const y = e.clientY - rect.top
                        for (const button of buttons){
                            if(
                                x >= button[0] && x <= button[0] + button[2] &&
                                y >= button[1] && y <= button[1] + button[3]
                            ){
                                Obj.self.removeEventListener("pointerdown", handleClick)
                                resolve(button[4])
                                break;
                            }
                        }
                    }

                    this.self.addEventListener('pointerdown', handleClick)
                })
    }

    drawButton(button, option, y=0){
        this.ctx.fillStyle = button.bgColor
        let buttonX = (this.width-this.width/1.5)/2
        let buttonY = this.height-(this.height/1.5)+y
        let buttonWidth = this.width/1.5
        this.ctx.fillRect(
            buttonX,
            buttonY,
            this.width/1.5,
            30
        )

        this.ctx.fillStyle = button.textColor
        this.ctx.font = "20px Arial"
        this.ctx.textAlign = "center"
        this.ctx.Baseline = "middle"
        this.ctx.fillText(button.text,
            (buttonX + (buttonWidth)/2),
            (buttonY)+30/1.25
        )

        return [buttonX, buttonY, buttonWidth, 30, option]

        // const Obj = this

        // function handleClick(e){
        //     const rect = Obj.self.getBoundingClientRect()
        //     const x = e.clientX - rect.left
        //     const y = e.clientY - rect.top
        //     if(
        //         x >= buttonX && x <= buttonX + buttonWidth &&
        //         y >= buttonY && y <= buttonY + 30
        //     ){
        //         Obj.self.removeEventListener("pointerdown", handleClick)
        //         Obj.curOpt = option
                
        //     }
        // }

        // this.self.addEventListener('pointerdown', handleClick)

    }
}

// Character class utilized for the player.

class Character{
    constructor(hp=4, mp=2, xp=0){
        this.HP = hp
        this.MAX_HP = hp
        this.MP = mp
        this.MAX_MP = mp
        this.EXP = xp
    }

    set addHP(value){
        console.assert(Number.isInteger(value), "Cannot add non integer type to character's HP")
        this.MAX_HP = this.MAX_HP+value
        this.HP = this.HP + value
    }
    set addMP(value){
        console.assert(Number.isInteger(value), "Cannot add non integer type to character's MP")
        this.MAX_MP = this.MAX_MP+value
        this.MP = this.MP + value
    }

    isDead(){
        return this.HP <= 0
    }
}
