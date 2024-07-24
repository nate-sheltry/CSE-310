'use strict'
import {Game, Character} from './classes.js'

const container = document.querySelector(".game-container")

const game = new Game()

console.log(game)

// set the width of the canvas to the container's size.
game.width = container.clientWidth
game.height = container.clientHeight

//Text Speeds
const SPEEDS = {S: 100, N: 10}

// Game Over screen
async function gameOver(){
    await game.postMsg("Though your efforts are valiant, in the end your efforts are for naught.", 20, true, SPEEDS.N)
    await game.postMsg("   G A M E   O V E R   ", 40, false, SPEEDS.S)
}

async function main(){
    await game.postMsg(" ", 32, false, SPEEDS.S)
    // Tell the user how to progress dialog
    alert("Use the enter button to progress dialog and click the buttons. Make sure the game is in focus.")
    await game.postMsg(" . . . Welcome.", 40, true, SPEEDS.S)
    await game.postMsg("Once a year, the village selects a champion."
        +" One who will enter the darkness that lies before us.", 20, true, SPEEDS.N)
    await game.postMsg("You are this champion. It is your time to travel the darkened road. As you walk the path amidst the mist you see an old, sickly women reaching out her hand.", 20, true, SPEEDS.N)
    await game.postMsg("\"Times long past it has been since a traveler has come this way. From whence do you herald?\"", 20, false, SPEEDS.N)
    let choice = await game.drawOptions([
        {bgColor:"white",textColor:"black",text:"The Southern Village"},
        {bgColor:"white",textColor:"black",text:"The Coastal Shore"}
    ])
    if(choice == 1){
        game.player.addHP = 1
        await game.postMsg("\"A common place for one to have come. Your people's endurance is admirable.\"", 20, true, SPEEDS.N)
    }
    else if(choice == 2){
        game.player.addMP = 1
        await game.postMsg("\"A peculiar people indeed. Said to have come from ancient times.\"", 20, true, SPEEDS.N)
    }
    await game.postMsg("\"There lies two paths before you, which shall you take?\"", 20, false, SPEEDS.N)
    const option = await game.drawOptions([
        {bgColor:"white",textColor:"black",text:"West Road"},
        {bgColor:"white",textColor:"black",text:"East Road"}
    ])
    if(option == 1){
        return await path1()
    }
    else if(option == 2){
        return await path2()
    }
}

async function path2(){
    await game.postMsg("As the eastern road winds and turns, the sky begins to turn red.", 20, true, SPEEDS.N)
    await game.postMsg("METEORITES!", 30, true, SPEEDS.N)
    await game.postMsg("As you try to dodge the giant rocks from the sky, you are crushed under their weight.", 20, true, SPEEDS.N)
    return await gameOver()
}

async function layAltar(){
    await game.postMsg("As you lay on the Altar you close your eyes waiting for the inevitable.", 20, true, SPEEDS.N)
    await game.postMsg("\"A Noble sacrifice my child. Such a fine offering I have been given.\"", 20, true, SPEEDS.N)
    await game.postMsg("As the sage pierces your abdomen with a blade, a burning sensation fills your body until it feels as though your very soul has been drained.", 20, true, SPEEDS.N)
    await game.postMsg("Just one more sacrifice from the village. Yet another person to be added to the pile.", 20, true, SPEEDS.S)
    return
}

async function readAltar(){
    await game.postMsg("The Altar of The Elders. The ancient glyphs and writings are vaguely familiar but their meaning is not quite understandable to you.", 20, true, SPEEDS.N)
    await game.postMsg("\"So, you are the new lamb?\". ", 20, true, SPEEDS.N)
}

async function sageMeeting(){
    await game.postMsg("Alas, you come to your destination, the Altar of The Elders. Before you lies a sage. Withered with age, even with the mist a layer of dust coats his clothes.", 20, false, SPEEDS.N)
    let options = await game.drawOptions([
        {bgColor:"white",textColor:"black",text:"Talk to Him"},
        {bgColor:"white",textColor:"black",text:"Inspect the Altar"}
    ])
    if(options == 2){
        await readAltar()
    }
    await game.postMsg("\"Every so often one of your kind comes, to sate the desire of him who shall never be sated.\". ", 20, true, SPEEDS.N)
    await game.postMsg("\"He goes by many names, but most are forgotten. The choice is yours, lay yourself upon the altar or slay this old vessel.\". ", 20, false, SPEEDS.N)
    options = await game.drawOptions([
        {bgColor:"white",textColor:"black",text:"Slay the Sage"},
        {bgColor:"white",textColor:"black",text:"Lay upon the Altar"}
    ])
    if (options == 1){
        return await sageFight()
    }
    await layAltar()
    await game.postMsg("\"Let the circle repeat. For noble blood shall reveal all.\"", 20, true, SPEEDS.N)
    await game.postMsg("   S a c r i f i c e   E n d i n g   ", 40, true, SPEEDS.S)
    return
}

async function sageFight(){
    const BOSS = new Character(5)
    await game.postMsg("As you draw your blade, readying to cut down the vile sage, his arm reaches out wrapping his fingers around your neck.", 20, false, SPEEDS.N)
    const options = await game.drawOptions([
        {bgColor:"white",textColor:"black",text:"Try to get Free"},
        {bgColor:"white",textColor:"black",text:"Continue with your Attack"}
    ])
    if(options == 1){
        game.player.HP -= 1
        await game.postMsg("In your attempt to get free, his grasp tightens restricting your ability to breath.", 20, false, SPEEDS.N)
        if(game.isGameOver()){
            return await gameOver()
        }
        let choice;
        if(game.player.MP > 0){
            choice = await game.drawOptions([
                {bgColor:"white",textColor:"black",text:"Summon Your Inner Strength"},
                {bgColor:"white",textColor:"black",text:"Give Up"}
            ])
            if(choice == 2){
                return await gameOver()
            }
            game.player.MP -= 1
            await game.postMsg("As you muster your inner strength, you feel power surge through you, giving you the strength to get free.", 20, true, SPEEDS.N)
        }
        else {
            choice = await game.drawOptions([
                {bgColor:"white",textColor:"black",text:"Give Up"}
            ])
            return await gameOver()
        }
        await game.postMsg("Having freed yourself, before you is another chance to act.", 20, false, SPEEDS.N)

    }
    if(options == 2){
        let choice;
        BOSS.HP -= 2
        await game.postMsg("As you carry through with your attack, the pain you imbue into the sage causes his grip to release. Giving you another chance to act.", 20, false, SPEEDS.N)
    }
    let choice;
    if(game.player.MP > 0){
        choice = await game.drawOptions([
            {bgColor:"white",textColor:"black",text:"Attack Him Again"},
            {bgColor:"white",textColor:"black",text:"Throw Him on the Altar"}
        ])
        if(choice == 2){
            return await sacrificeSage()
        }
    }
    else {
        choice = await game.drawOptions([
            {bgColor:"white",textColor:"black",text:"Attack Him Again"}
        ])
    }
    BOSS.HP -= 2
    await game.postMsg("The blade cuts through the frail Sage's body, revealing a dark mixture where blood should be. His groans echoing into the night.", 20, true, SPEEDS.N)
    await game.postMsg("What will you do?", 20, false, SPEEDS.N)
    choice = await game.drawOptions([
        {bgColor:"white",textColor:"black",text:"Shove the Sage"},
        {bgColor:"white",textColor:"black",text:"Throw Him on the Altar"}
    ])
    if(choice == 2)
        return await sacrificeSage()
    await game.postMsg("As you push the Sage, he grabs ahold of your arm falling with you.", 20, true, SPEEDS.N)
    await game.postMsg("Something is wrong. You should have hit the ground by now.", 20, true, SPEEDS.S)
    await game.postMsg("You realize, just moments before hitting the ground. You have fallen off a cliff. You die hearing the cackling of the Sage.", 20, true, SPEEDS.N)
    await game.postMsg("A True Champion, you have saved your village, but at a great cost. The sage undoubtedly died with you...", 20, true, SPEEDS.N)
    await game.postMsg("Or did he?", 20, true, SPEEDS.S)
    return await game.postMsg("   N o b l e   S a c r i f i c e   E n d i n g   ", 40, true, SPEEDS.S)
}

async function sacrificeSage(){
    await game.postMsg("As you grab ahold of the Sage, you manage to throw him onto the Altar.", 20, true, SPEEDS.N)
    await game.postMsg("Emitting bestial cackles and laughter, he struggles against your power.", 20, true, SPEEDS.N)
    await game.postMsg("\"Your resistance is futile.\"", 20, true, SPEEDS.N)
    await game.postMsg("You use your weapon and make the sage a sacrifice, ending his life.", 20, true, SPEEDS.N)
    await game.postMsg("As his cackles and chiding fades into silence the mist around you begins to lift.", 20, true, SPEEDS.N)
    await game.postMsg("You have saved your village and have ended the barbaric tradition.", 20, true, SPEEDS.N)
    return await game.postMsg("   G o o d   E n d i n g   ", 40, true, SPEEDS.S)

}

async function creatureEncounter(){
    await game.postMsg("As you turn your back to the cave, a GIANT claw lashes out at you! ", 20, true, SPEEDS.N)
    game.player.HP = game.player.HP - 2
    await game.postMsg("Bloodied and weak you turn to face the creature! Its red eyes twisting in the darkness of the land, its figure indiscernible. ", 20, true, SPEEDS.N)
    await game.postMsg("You have only a moment to determine your action. What will you do? ",20, false, SPEEDS.N)
    const choice = await game.drawOptions([
        {bgColor:"white",textColor:"black",text:"Face the Creature"},
        {bgColor:"white",textColor:"black",text:"Try to Run"}
    ])
    if(choice == 1){
        await game.postMsg("Facing the creature, you make firm your determination and embrace the monster in battle. ", 20, true, SPEEDS.N)
        game.player.HP -= 1
        await game.postMsg("Having faced the monster, it cowers before your unrelenting will, fleeing into the mist filled night. ", 20, true, SPEEDS.N)
    }
    else if(choice == 2){
        await game.postMsg("Unfortunately, you are too slow. The creature grabs ahold of you and prevents you from leaving, as its sharp teeth are felt against your side. ", 20, true, SPEEDS.N)
        game.player.HP = game.player.HP - 2
        if(game.isGameOver()){
            return await gameOver()
        }
        await game.postMsg("Moments away from death, you recall memories of the village. All will be for not if you die here. ", 20, false, SPEEDS.N)
        const choice = await game.drawOptions([
            {bgColor:"white",textColor:"black",text:"Call Upon Your Soul"},
            {bgColor:"white",textColor:"black",text:"Fade Into Death"}
        ])
        if(choice == 1){
            game.player.MP -= 2
            await game.postMsg("As you feel power come from some place within you; a blinding light emits from you. The creature, screams out in agony before dying and fading away entirely. ", 20, true, SPEEDS.N)
        }
        if(choice == 2){
            return await gameOver()
        }
    }
    return
}

async function path1(){
    await game.postMsg("As you travel down the western road, a tinge of light seems to pierce the mist. ", 20, true, SPEEDS.N)
    await game.postMsg("Upon getting closer you see the light is being emitted from a cave. No other path lays before you. What shall you do? ", 20, false, SPEEDS.N)
    const option = await game.drawOptions([
        {bgColor:"white",textColor:"black",text:"Enter the Cave"},
        {bgColor:"white",textColor:"black",text:"Turn Back"}
    ])
    if(option == 2){
        await creatureEncounter()
    }
    await game.postMsg("Upon entering the cave, the light seems to dissipate some, as if it is luring you deeper. ", 20, true, SPEEDS.N)
    await game.postMsg("The further you go, the more ominous this place feels, the ceilings drippings echoing through the cavernous walls. ", 20, true, SPEEDS.N)
    await game.postMsg("Finally, you reach the end, but not before noticing a crude writing left on the cave wall. ", 20, true, SPEEDS.N)
    await game.postMsg("\"Turn back... The village lies, save yourself.\" ", 20, true, SPEEDS.N)
    await game.postMsg("With the cave being your only option back, not much is left but to push forward back into the mist. As you do so, you see items strewn about upon the ground.", 20, true, SPEEDS.N)
    await game.postMsg("Weapons, clothing, satchels, bags; everything a traveler or champion would have. What cruel fate did those before you meet?", 20, true, SPEEDS.N)
    return await sageMeeting()
}

main()