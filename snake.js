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

if(typeof console == "undefined") var console = { log: function(){}}

//load audio
let eat = new Audio();
let die = new Audio();
let wocky = new Audio();
let sky = new Audio();
let yoshi = new Audio();

sky.src = "audio/sky.mp3";
eat.src = "audio/coin.mp3";
die.src = "audio/oof.mp3";
wocky.src = "audio/wock.mp3";
yoshi.src = "audio/yoshi.mp3";

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

//snake play direction
let d;

//ai direction
var current_direction;

//get default mode
var mode = 1;

//declare snake vision
var snakeVision = document.getElementById("vision");

//control snake manually
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

// collision function
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
    
    //play/ai radio buttons
    // var playMode = document.getElementById("play");
    // var aiMode = document.getElementById("ai");

    //enable arrow keys with play mode
    if(mode == 1){
        d = direction;
        if(d == "LEFT") snakeX -= box;
        if(d == "UP") snakeY -= box;
        if(d == "RIGHT") snakeX += box;
        if(d == "DOWN") snakeY += box;
    }

    //AI MODE 1
    if(mode == 2){
        //Left
        if(snakeX > food.x && current_direction != "RIGHT"){
            current_direction = "LEFT";
            snakeX -= box;
        } 
        //Right
        else if(snakeX < food.x && current_direction != "LEFT"){
            current_direction = "RIGHT";
            snakeX += box;
        }
        //Up
        else if(snakeY > food.y && current_direction != "DOWN"){
            current_direction = "UP";
            snakeY -= box;
        } 
        //Down
        else if(snakeY < food.y && current_direction != "UP"){
            current_direction = "DOWN";
            snakeY += box;
        }
        // IF FOOD SPAWNS DIRECTLY BEHIND A.I. ---> RUN INTO WALL 
        // AI VERSION 1 WEAKNESS:
        // 1. Cannot Detect Body
        // 2. Cannot Handle Food Spawning Behind It
        else{
            switch(current_direction){
                case "LEFT":
                    current_direction = "LEFT";
                    snakeX -= box;
                    break;
                case "RIGHT":
                    current_direction = "RIGHT";
                    snakeX += box;
                    break;
                case "UP":
                    current_direction = "UP";
                    snakeY -= box;
                    break;
                case "DOWN":
                    current_direction = "DOWN";
                    snakeY += box;
                    break;
            }
            
        }
        
     }
    
//A* Pathfinding Mode
if(mode == 3){

    //make world
    var world = [[]];


    //find open spots
    for(var x = 0; x < 45*box; x+=box){
        world[x] = [];
        for(var y = 0; y < 30*box; y+=box){
            world[x][y] = 3;
        }
    }
        
    //find closed spots
    for(var i = 1; i < snake.length; i++){
        world[snake[i].x][snake[i].y] = 1;
    }
    
    function fill(data, x, y, newValue){
        // get target value
        var target = data[x][y];

        function flow(x,y){
            // bounds check what we were passed
            if( x >= 0 && x < 45*box && y >= 0 && y < 30*box){
                if(data[x][y] === target){
                    data[x][y] = newValue;
                    flow(x - box, y);
                    flow(x + box, y);
                    flow(x, y - box);
                    flow(x, y + box);
                }
            }
        }
        flow(x, y);
    }

    fill(world, snake[0].x, snake[0].y, 0);


    //highlight selected path
    for(var x = 0; x < 45*box; x+=box){
        for(var y = 0; y < 30*box; y+=box){
            if(snakeVision.checked == true){
                world[snake[0].x][snake[0].y] = 4;
                if(world[x][y] == 0 && world[food.x][food.y] == 3){
                    ctx.fillStyle = 'rgba(255,0,0,0.5)';
                    ctx.fillRect(x, y, box, box);  
                    ctx.restore();
                }
                else if(world[x][y] == 0){
                    ctx.fillStyle = 'rgba(255,255,51,0.2)';
                    ctx.fillRect(x, y, box, box);  
                    ctx.restore();
                }
                else if(world[x][y] == 3){
                    ctx.fillStyle = 'rgba(0,0,0,.7)';
                    ctx.fillRect(x, y, box, box);  
                    ctx.restore();
                }
            }
        }
    }
    world[snake[0].x][snake[0].y] = 0;
    //start of path
    var pathStart = [snake[0].x, snake[0].y];

    //end of path
    if(world[food.x][food.y] == 0){
        var pathEnd = [food.x, food.y];
    }
    else{

        var randomVisiblePoint = {
            x : Math.floor(Math.random()*45)*box,
            y : Math.floor(Math.random()*30)*box
        }

        while(world[randomVisiblePoint.x][randomVisiblePoint.y] != 0){
            randomVisiblePoint.x = Math.floor(Math.random()*45)*box;
            randomVisiblePoint.y = Math.floor(Math.random()*30)*box;
        }

        var pathEnd = [randomVisiblePoint.x, randomVisiblePoint.y];
    }

    //var pathEnd = [food.x, food.y];

    //current point of path
    var currentPath = [];

    // begin algorithm  to find shortest path

    while(currentPath.length == 0){
        if(world[pathStart[0]][pathStart[1]] == 0){
            currentPath = findPath(world, pathStart, pathEnd);
        }
    }
    if (currentPath.length == 0){
        snakeY -= box;
    }

    for(rp = 1; rp < currentPath.length; rp++){
        if(snakeVision.checked == true && world[food.x][food.y] != 3){
                ctx.fillStyle = 'rgba(255,0,0,0.5)';
                ctx.fillRect(currentPath[rp][0], currentPath[rp][1], box, box);
        }

    }

    //UP
    if(currentPath[1][1] < snake[0].y && currentPath[1][0] == snake[0].x){
    snakeY -= box;
    }
    //DOWN
    if(currentPath[1][1] > snake[0].y && currentPath[1][0] == snake[0].x){
    snakeY += box;
    }
    //RIGHT
    if(currentPath[1][1] == snake[0].y && currentPath[1][0] > snake[0].x){
    snakeX += box;
    }
    //LEFT
    if(currentPath[1][1] == snake[0].y && currentPath[1][0] < snake[0].x){
    snakeX -= box;
    }
    
    function findPath(world, pathStart, pathEnd){
    // math short cuts
    var abs = Math.abs;

    // max number of traverses
    var maxTraversable = 0;

    //dimensions;
    var worldWidth = 45*box;
    var worldHeight = 30*box;
    var worldSize = worldWidth * worldHeight;
    
    var distance = ManhattanDistance;
    var findNeighbours = function(){};

    //mathattan distance formula
    function ManhattanDistance(point, goal){
        return abs(point.x - goal.x) + abs(point.y - goal.y);
    }
    
    function Neighbours(x, y){
        var N = y - box, S = y + box, E = x + box, W = x - box,

        myN = N > -box && canWalkHere(x,N),
        myS = S < worldHeight && canWalkHere(x,S),
        myE = E < worldWidth && canWalkHere(E,y),
        myW = W > -box && canWalkHere(W,y),

        result = [];
        if(myN)
        result.push({x:x, y:N});
        
        if(myE)
        result.push({x:E, y:y});
        
        if(myS)
        result.push({x:x, y:S});
        
        if(myW)
        result.push({x:W, y:y});
    
        findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
        return result;
        
    }
    function canWalkHere(x, y){
        return ((world[x] != null) && (world[x][y] != null) && (world[x][y] <= maxTraversable));
    };
    function Node(parent, point){
        var newNode = {
            parent: parent,
            value: point.x + (point.y * worldWidth),
            x:point.x, 
            y:point.y,
            f:0,
            g:0
        };
        return newNode;
    };
    function calculatePath(){
        var myPathStart = Node(null,{x:pathStart[0], y:pathStart[1]});
        var myPathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});

        var AStar = new Array(worldSize);

        var Open = [myPathStart];

        var Closed = [];

        var result = [];

        var myNeighbours;

        var myNode;

        var myPath;

        var length, max, min, i, j;


        while(length = Open.length){
            max = worldSize;
            min = -1;
            for(i = 0; i < length; i++){
                if(Open[i].f < max){
                    max = Open[i].f;
                    min = i;
                }
                
            }
            myNode =  Open.splice(min, 1)[0];

            if(myNode.value === myPathEnd.value){
                myPath = Closed[Closed.push(myNode) - 1];
                do{
                    result.push([myPath.x, myPath.y]);
                }
                while(myPath = myPath.parent);
                AStar = Closed = Open = [];
                result.reverse();
            }

            else{
                myNeighbours = Neighbours(myNode.x, myNode.y);
                for(i = 0, j = myNeighbours.length; i < j; i++){
                    myPath = Node(myNode, myNeighbours[i]);
                    if(!AStar[myPath.value]){
                        myPath.g = myNode.g + distance(myNeighbours[i], myNode);
                        myPath.f = myPath.g + distance(myNeighbours[i], myPathEnd);
                            Open.push(myPath);
                        AStar[myPath.value] = true;
                    }
                }
                Closed.push(myNode);
            }
        }
        return result;
    }
    return calculatePath();
    }
        
}

     // a function to spawn food
     function spawnFood(){
        var prevFoodX = food.x;
        var prevFoodY = food.y; 

        // spawn food randomly
        food = {
            x : Math.floor(Math.random()*45)*box,
            y : Math.floor(Math.random()*30)*box
        }

        // if food spawns on snake keep respawning until it is no longer on the snake
        for(let i = 0; i < snake.length; i++){
            if(collision(food, snake) || (prevFoodX == food.x && prevFoodY == food.y)){
                spawnFood();
            }
        }
     }
    
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
        spawnFood();
        
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
        // die.play();
    }

    snake.unshift(newHead);

    //scoreboard
    sb.fillStyle = "black";
    sb.fillRect(100,10, 100, 100)
    sb.fillStyle = "white";
    sb.font = "40px Poppin";
    sb.drawImage(logo, 36, 0)
    sb.fillText(" : ", 90, 40);
    sb.fillText(score, 130, 43);

 }

//call draw function
let game = setInterval(draw, 65);

var defaultSpeed = document.getElementById("default");
var slowSpeed = document.getElementById("slow");
var fastSpeed = document.getElementById("fast");
var ultraSpeed = document.getElementById("ultra")
var playMode = document.getElementById("play");
var aiMode = document.getElementById("ai");
var aiMode2 = document.getElementById("ai2");

function changeSpeed(){

    if(defaultSpeed.checked == true){
        speed = 65;
    }
    else if(slowSpeed.checked == true){
        speed = 110;
    }
    else if(fastSpeed.checked == true){
        speed = 35;
    }
    else if(ultraSpeed.checked == true){
        speed = 15;
    }
}

function changeMode(){
    if(playMode.checked == true){
        mode = 1;
    }
    else if(aiMode.checked == true){
        mode = 2;
    }
    else if(aiMode2.checked == true){
        mode = 3;
    }
}

function resetGame(){
    changeSpeed();
    changeMode();
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

