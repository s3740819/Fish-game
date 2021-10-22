const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;
let canvasPosition = canvas.getBoundingClientRect();
let bubbleList;
let monsterList;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
ctx.font = "50px Georgia";
const bubblePop = document.createElement('audio');
const monsterEat = document.createElement('audio');
const fishDirection = new Image();
const bubbleImage = new Image();
bubbleImage.src = "bubble.png";
const body = document.getElementsByTagName("body")[0];
let play = false;
const video = document.getElementById("video");
let life;
let gameOver;
let fish;


const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    hold: false,
};

body.addEventListener('keypress', (event)=>{
    if (event.key === 'Enter' && (!play || gameOver)) {
        play = true;
        life = 5;
        gameOver = false;
        bubbleList = [];
        monsterList = [];
        score = 0;
        mouse.x = canvas.width/2;
        mouse.y = canvas.height/2;
        fish = new Fish();
        video.play();
    }
})

canvas.addEventListener('mousedown', ()=>{
    mouse.hold = true;
});

canvas.addEventListener('mouseup', ()=>{
    mouse.hold = false;
})

canvas.addEventListener('mousemove', (e)=>{
    if (e.x >= canvasPosition.left && e.y >= canvasPosition.top && mouse.hold){
        mouse.x = e.x - canvasPosition.left;
        mouse.y = e.y - canvasPosition.top;
    }
});

class Fish{
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        this.angle = Math.atan2(dy, dx);
        if(dx != 0) this.x -= dx/5;
        if(dy != 0) this.y -= dy/5;
    }
    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        fishDirection.src = (this.x >= mouse.x) ? "left.png" : "right.png";
        ctx.drawImage(fishDirection, 0, 0, 498, 327, 0 - 50, 0 - 65, 498/2.5, 327/1.9);
        ctx.restore();
    }
}

class Bubble {
    constructor(){
        this.x = canvas.width - Math.random() * canvas.width;
        this.y = canvas.height;
        this.radius = 50;
        this.speed = Math.random() * 10 + 1;
        this.distace;
    }
    update(){
        this.y -= this.speed;
        const dx= this.x - fish.x;
        const dy = this.y - fish.y;
        this.distace = Math.sqrt(dx*dx + dy*dy);
    }
    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(bubbleImage, 0, 0, 498, 400, 0-50, 0-50, 498/3.3, 327/3.3);
        ctx.restore();
    }
}

class Monster{
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height - Math.random() * canvas.height;
        this.image = new Image();
        this.image.src = (Math.random() < 0.5) ? "mons1.png" : "mons2.png";
        this.speed = Math.random() * 10 + 7;
        this.distace;
        this.width = 200;
        this.height = 60;
    }
    update(){
        this.x -= this.speed;
    }
    draw(){
        ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
    }
}

function handleMonsters(){
    if(Math.random() * 100 <= 2){
        monsterList.push(new Monster());
    }
    if (monsterList.length > 0){
        monsterList.forEach(monster => {
            monster.update();
            monster.draw();
        });
        for (let i = 0; i < monsterList.length; i++){
            let monster = monsterList[i];
            if(monster.x < 0) monsterList.splice(i,1);
            else{
                if(checkOverlap(monster, fish)) {
                    life--;
                    monsterList.splice(i,1);
                    monsterEat.src = "sound3.wav";
                    monsterEat.play();
                    canvas.style.border = "4px solid red";
                    setTimeout(function(){
                        canvas.style.border = "2px solid";
                    }, 100)
                }
            }
        }
    }
}
var checkOverlap = function(monster, fish) {
    function getDistanceToHorizontal(xA, xB, y) {
        let distance3 = Infinity
        if (xA < fish.x && fish.x < xB) {
            distance3 = (fish.y - y) ** 2
            return distance3
        }
        
        const distance1 = (fish.x - xA) ** 2 + (fish.y - y) ** 2
        const distance2 = (fish.x - xB) ** 2 + (fish.y - y) ** 2
        
        let result = Math.min(distance1, distance2)
        return result
    }
    
    function getDistanceToVertical(yA, yB, x) {
        let distance3 = Infinity
        if (yA < fish.y && fish.y < yB) {
            distance3 = (fish.x - x) ** 2
            return distance3
        }
    
        const distance1 = (fish.y - yA) ** 2 + (fish.x - x) ** 2
        const distance2 = (fish.y - yB) ** 2 + (fish.x - x) ** 2
        
        let result = Math.min(distance1, distance2)
        return result
    }
    
    
    // check whether circle's center is inside rectangle
    if ((monster.x < fish.x && fish.x < monster.x+ monster.width) && (monster.y < fish.y && fish.y < monster.y + monster.height)) {
        return true;
    }
    
    
    // check whether circle's radius can reach rectangle
    const distanceValve = fish.radius ** 2
    if (getDistanceToHorizontal(monster.x, monster.x + monster.width, monster.y) <= distanceValve)   return true
    if (getDistanceToHorizontal(monster.x, monster.x + monster.width, monster.y + monster.height) <= distanceValve)   return true
    if (getDistanceToVertical(monster.y, monster.y + monster.height, monster.x) <= distanceValve) return true
    if (getDistanceToVertical(monster.y, monster.y + monster.height, monster.x + monster.width) <= distanceValve) return true
    
    
    return false
};

function handleBubbles(){
    if(Math.random() * 100 + 1 > 99){
        bubbleList.push(new Bubble());
    }
    if (bubbleList.length > 0){
        bubbleList.forEach(bubble => {
            bubble.update();
            bubble.draw();
        });
        for (let i = 0; i < bubbleList.length; i++){
            let bubble = bubbleList[i];
            if(bubble.y < 0 - bubble.radius*2) bubbleList.splice(i,1);
            else{
                if(bubble.distace < bubble.radius + fish.radius) {
                    score++;
                    bubbleList.splice(i,1);
                    bubblePop.src = (Math.random() < 0.5) ? "sound1.wav" : "sound2.wav";
                    bubblePop.play();
                }
            }
        }
    }
}

function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    if (play){
        if(life == 0) gameOver = true;
        else{
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.fillStyle= 'red';
            let text = 'Score: ' + score + ' -- Life: ';
            for(let i = 0; i < life; i++){
                text += '♥';
            }
            ctx.fillText(text, 10, 50);
            handleBubbles();
            handleMonsters();
            fish.update();
            fish.draw();
        }
    }
    else ctx.fillText("Press Enter To Play!", canvas.width/2.7, canvas.height/2);

    if (gameOver){
        ctx.fillText("Press Enter To Play Again! Your Score Is: " + score, 10, canvas.height/2);
    }
    requestAnimationFrame(animate);
}

animate();