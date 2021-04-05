const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const scoreboard = document.getElementById("scoreboard");
const sb = scoreboard.getContext("2d");

//make box
const box = 32;

//load images

const board = new Image();
board.src = "pictures/board2.jpg";

const apple = new Image();
apple.src = "pictures/apple.png";

const logo = new Image();
logo.src = "pictures/alogo.png";

const lean = new Image();
lean.src = "pictures/wock.png";

const skyrim = new Image();
skyrim.src = "pictures/skyrim.png";

//load audio
let eat = new Audio();
let die = new Audio();
let wocky = new Audio();
let sky = new Audio();

sky.src = "audio/sky.mp3";
eat.src = "audio/coin.mp3";
die.src = "audio/oof.mp3";
wocky.src = "audio/wock.mp3";

//make snake
let snake = [];

snake[0] = {
    x : 22*box, 
    y : 15*box
};

//make food

let food = {
    x : Math.floor(Math.random()*45)*box,
    y : Math.floor(Math.random()*30)*box
};

//create score
let score = 0;

//control snake
let d;

document.addEventListener("keydown", direction);
function direction(event){

    let key = event.keyCode;

    if(key == 37 && d != "RIGHT"){
        direction = "LEFT";
    } else if(key == 38 && d != "DOWN"){
        direction = "UP";
    } else if(key == 39 && d != "LEFT"){
        direction = "RIGHT";
    } else if(key == 40 && d != "UP"){
        direction = "DOWN";
    }
}

// colision function
function collision(head, array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
}

//draw to canvas
function draw(){

    ctx.drawImage(board, 0, 0);

    for(let i = 0; i < snake.length; i++){
        
        // color if Dragon Born
        if(score%20 <= 0 && score != 0){
            ctx.fillStyle = (i == 0)? "DarkGreen" : "black";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);

            ctx.strokeStyle = "green";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        // color if wocky slush
        else if(score%8 <= 0 && score != 0){
            ctx.fillStyle = (i == 0)? "black" : "purple";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);

            ctx.strokeStyle = "violet";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
        // color regular snake
        else{
            ctx.fillStyle = (i == 0)? "black" : "DarkRed";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
            ctx.strokeStyle = "red";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
    }
    // draw skyrim food if 20 combo
    if(score%20 == 19){
        ctx.drawImage(skyrim, food.x, food.y);
    }
    // draw wock food if 8 combo
    else if (score%8 == 7){
        ctx.drawImage(lean, food.x, food.y);
    }
    // draw regular apple
    else{
        ctx.drawImage(apple, food.x, food.y);
    }

    //old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    

    //which direction
    d = direction;
    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;


    // snake eats food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        //play sky music if 20 combo
        if(score%20 == 0){
            sky.play();
        }
        //play wocky if 8 combo
        else if (score%8 == 0){
            wocky.play();
        }
        else{
        eat.play();
        }
        food = {
            x : Math.floor(Math.random()*45)*box,
            y : Math.floor(Math.random()*30)*box
        }
    } 
    else{
        snake.pop(); //remove tail 
    }

    // add head

    let newHead = {
        x : snakeX,
        y : snakeY
    }

    // end game

    if(snakeX < 0 || snakeX >= 45 * box || snakeY >= 30 * box || snakeY < 0 || collision(newHead, snake)){
        clearInterval(game);
        die.play();
    }

    snake.unshift(newHead);

    //scoreboard
    sb.fillStyle = "black";
    sb.fillRect(100,10, 80, 100)
    sb.fillStyle = "white";
    sb.font = "40px Poppin";
    sb.drawImage(logo, 36, 0)
    sb.fillText(" : ", 90, 40);
    sb.fillText(score, 130, 43);

 }

//call draw function
let game = setInterval(draw, 65);

function resetGame(){
    var speed = 65;
    var defaultSpeed = document.getElementById("default");
    var slowSpeed = document.getElementById("slow");
    var fastSpeed = document.getElementById("fast");
    if(defaultSpeed.checked == true){
        speed = 65;
    }
    else if(slowSpeed.checked == true){
        speed = 100;
    }
    else if(fastSpeed.checked == true){
        speed = 30;
    }
    clearInterval(game);
    score = 0;
    direction = 0;
    snake.length = 1;
    snake[0] = {
        x : 22*box, 
        y : 15*box
    };
    food = {
        x : Math.floor(Math.random()*45)*box,
        y : Math.floor(Math.random()*30)*box
    }
    game = setInterval(draw, speed);
}

