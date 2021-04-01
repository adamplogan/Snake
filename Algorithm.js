const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

//make box
const box = 32;

//load images

const board = new Image();
board.src = "pictures/board.jpg";

const apple = new Image();
apple.src = "pictures/apple.png";

//load audio
let eat = new Audio();
let die = new Audio();

eat.src = "audio/coin.mp3";
die.src = "audio/wock.mp3";

//make snake
let snake = [];

snake[0] = {
    x : 7*box, 
    y : 7*box
};

//make food

let food = {
    x : Math.floor(Math.random()*15)*box,
    y : Math.floor(Math.random()*15)*box
};

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

        ctx.fillStyle = (i == 0)? "black" : "DarkRed";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    
    ctx.drawImage(apple, food.x, food.y)

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
        eat.play();
        food = {
            x : Math.floor(Math.random()*15)*box,
            y : Math.floor(Math.random()*15)*box
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

    if(snakeX < 0 || snakeX >= 15 * box || snakeY >= 15 * box || snakeY < 0 || collision(newHead, snake)){
        clearInterval(game);
        die.play();
    }

    snake.unshift(newHead);

 }

//call draw function
let game = setInterval(draw, 100);

