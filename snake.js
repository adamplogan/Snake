const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const scoreboard = document.getElementById("scoreboard");
const sb = scoreboard.getContext("2d");


function openFullscreen(){
    if(cvs.requestFullscreen){
        cvs.requestFullscreen();
    } else if(cvs.webkitRequestFullscreen){
        cvs.webkitRequestFullscreen;
    } else if(cvs.msRequestFullscreen){
        cvs.msRequestFullscreen();
    }
}

let defaultSize = {
    x : 22,
    y : 15,
    b : 64,
    xh : 11,
    yh : 7
};

//make box
const box = defaultSize.b;

//load images

const board = new Image();
const logo = new Image();
const apple = new Image();
const apple2 = new Image();
const apple3 = new Image();
const apple4 = new Image();
const apple5 = new Image();

board.src = "pictures/board3.jpg";
logo.src = "pictures/alogo.png";
apple.src = "pictures/apple1.png";
apple2.src = "pictures/apple2.png";
apple3.src = "pictures/apple3.png";
apple4.src = "pictures/apple4.png";
apple5.src = "pictures/apple5.png";

if(typeof console == "undefined") var console = { log: function(){}}

//load audio
let eat1 = new Audio();
let eat2 = new Audio();
let eat3 = new Audio();
let eat4 = new Audio();
let eat5 = new Audio();
let die = new Audio();


eat1.src = "audio/eat1.mp3";
eat2.src = "audio/eat2.mp3";
eat3.src = "audio/eat3.mp3";
eat4.src = "audio/eat4.mp3";
eat5.src = "audio/eat5.mp3";
die.src = "audio/die.mp3";

//mute button
var mute = document.getElementById("mute");


eat1.volume = 0.05;
eat2.volume = 0.05;
eat3.volume = 0.05;
eat4.volume = 0.05;
eat5.volume = 0.05;
die.volume = 0.05;

//make snake

let snake = [];

let snakeTracks = [];

var escapeStart = [(defaultSize.xh)*box, (defaultSize.yh)*box];

var panic = false;

var modeSwitch = false;

var pathGone = false;

var snakeOnLine = true;

var hamilton = true;

var max = false;

var lineWidth = 4;



snake[0] = {
    x : (defaultSize.xh)*box, 
    y : (defaultSize.yh)*box
};

snakeTracks[0] = {
    x : (defaultSize.xh)*box, 
    y : (defaultSize.yh)*box
};



//make food

let food = {
     x : Math.floor(Math.random()*(defaultSize.x))*box,
     y : Math.floor(Math.random()*(defaultSize.y))*box
};

//create score
let score = 0;
let sum = 0;

//snake play direction
let d;

//ai direction
var current_direction;
var directionPath = [];

//get default mode
var mode = 0;

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

var hamCycle2 = [];
var hamCycle2Nums = [[251, 250, 249, 242, 241, 236, 235, 234, 227, 226, 223, 222, 191, 190, 181, 180, 177, 176, 161, 160, 149, 148],
                    [252, 247, 248, 243, 240, 237, 232, 233, 228, 225, 224, 221, 192, 189, 182, 179, 178, 175, 162, 159, 150, 147],
                    [253, 246, 245, 244, 239, 238, 231, 230, 229, 218, 219, 220, 193, 188, 183, 184, 173, 174, 163, 158, 151, 146],
                    [254, 255, 256, 207, 208, 209, 210, 211, 212, 217, 216, 195, 194, 187, 186, 185, 172, 171, 164, 157, 152, 145],
                    [259, 258, 257, 206, 205, 204, 203, 202, 213, 214, 215, 196, 131, 132, 133, 134, 169, 170, 165, 156, 153, 144],
                    [260,  41,  42,  43,  44,  45,  46, 201, 200, 199, 198, 197, 130, 129, 128, 135, 168, 167, 166, 155, 154, 143],
                    [261,  40,  37,  36,  35,  34,  47,  48,  49,  50,  51,  52,  53,  54, 127, 136, 137, 138, 139, 140, 141, 142], 
                    [262,  39,  38, 291, 292,  33,  32,  31,  30,  29,  28, 329, 328,  55, 126, 125, 124, 123, 122, 121, 120, 119],
                    [263, 276, 277, 290, 293,  22,  23,  24,  25,  26,  27,   0, 327,  56, 111, 112, 113, 114, 115, 116, 117, 118],
                    [264, 275, 278, 289, 294,  21,  20,  19,  18,  17,  16,   1, 326,  57, 110, 109, 102, 101,  96,  95,  90,  89],
                    [265, 274, 279, 288, 295,  10,  11,  12,  13,  14,  15,   2, 325,  58, 107, 108, 103, 100,  97,  94,  91,  88],
                    [266, 273, 280, 287, 296,   9,   8,   7,   6,   5,   4,   3, 324,  59, 106, 105, 104,  99,  98,  93,  92,  87],
                    [267, 272, 281, 286, 297, 302, 303, 314, 315, 316, 317, 318, 323,  60,  79,  80,  81,  82,  83,  84,  85,  86],
                    [268, 271, 282, 285, 298, 301, 304, 313, 312, 311, 310, 319, 322,  61,  78,  77,  76,  75,  74,  73,  72,  71],
                    [269, 270, 283, 284, 299, 300, 305, 306, 307, 308, 309, 320, 321,  62,  63,  64,  65,  66,  67,  68,  69,  70]];


for(var k = 0; k <= 330; k++){
    for(var i = 0; i < 15; i++){
        for(var j = 0; j < 22; j++){
            if(hamCycle2Nums[i][j] == k){
                hamCycle2.push([j*box, i*box]);
            }
        }
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

    var isColored = false;
    var coloredAppleChance = Math.floor(Math.random()*100) + 1;
    var whichApple = Math.floor(Math.random()*4) + 1;
    var snakeColor = "white";
    var headColor = "white";
    var appleColor = "white";
    var appleColor2 = "white";


//draw to canvas
function draw(){

    ctx.drawImage(board, 0, 0);
    ctx.lineWidth = 5;

    // ctx.strokeStyle = "white";
    // ctx.strokeRect(0, 0, (defaultSize.x)*box, (defaultSize.y)*box);

    isColored = false;

    if(score >= 150 && coloredAppleChance <= 100){
        isColored = true;
    }
    else if(score >= 125 && coloredAppleChance <= 90){
        isColored = true;
    }
    else if(score >= 100 && coloredAppleChance <= 80){
        isColored = true;
    }
    else if(score >= 50 && coloredAppleChance <= 70){
        isColored = true;
    }
    else if(score >= 25 && coloredAppleChance <= 60){
        isColored = true;
    }
    else if(score >= 5 && coloredAppleChance <= 50){
        isColored = true;
    }

     // spawn green apple 
     if(isColored && whichApple == 1){
        ctx.drawImage(apple3, food.x, food.y);
        appleColor = "Lime";
        appleColor2 = "GreenYellow"
    }
    // spawn purple apple
    else if (isColored && whichApple == 2){
       
        ctx.drawImage(apple2, food.x, food.y);
        appleColor = "Magenta";
        appleColor2 = "Fuchsia"

    }
    // spawn blue apple
    else if (isColored && whichApple == 3){
        ctx.drawImage(apple4, food.x, food.y);
        appleColor = "DeepSkyBlue";
        appleColor2 = "DodgerBlue"

    }
    // spawn orange apple
    else if (isColored && whichApple == 4){
        ctx.drawImage(apple5, food.x, food.y);
        appleColor = "OrangeRed";
        appleColor2 = "#ff4000"

    }
    // draw regular apple
    else{
        ctx.drawImage(apple, food.x, food.y);
        appleColor = "white";
        appleColor2 = "white"
        
    }

        for(let i = 0; i < snake.length; i++){

            
            ctx.fillStyle = (i == 0)? headColor : snakeColor;
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
            // ctx.strokeStyle = "black";
            // ctx.strokeRect(snake[i].x, snake[i].y, box, box);


        }
        // create lines for snake body
        for(var y = 0; y < (defaultSize.y); y++){
            for(var x = 0; x < (defaultSize.x); x++){
                for(var i = 0; i < snake.length - 1; i++){
                    if(snake[i].x/box == x && snake[i].y/box == y && i != 0){
                        if(x + 1 != snake[i+1].x/box && x + 1 != snake[i-1].x/box){
                            ctx.beginPath();
                            ctx.strokeStyle = "black";
                            ctx.lineWidth = lineWidth;
                            ctx.moveTo(x*box + box, y*box);
                            ctx.lineTo(x*box + box, (y+1)*box);
                            ctx.stroke();
                        }
                        if(y + 1 != snake[i+1].y/box && y + 1 != snake[i-1].y/box){
                            ctx.beginPath();
                            ctx.strokeStyle = "black";
                            ctx.lineWidth = lineWidth;
                            ctx.moveTo(x*box, y*box + box);
                            ctx.lineTo((x+1)*box, y*box + box);
                            ctx.stroke();
                        }
                    }
                    //create correct line for snake head
                    if(x == snake[0].x/box && y == snake[0].y/box && i == 0){
                        if(x + 1 != snake[i+1].x/box){
                            ctx.beginPath();
                            ctx.strokeStyle = "black";
                            ctx.lineWidth = lineWidth;
                            ctx.moveTo(x*box + box, y*box);
                            ctx.lineTo(x*box + box, (y+1)*box);
                            ctx.stroke();
                        }
                        if(y + 1 != snake[i+1].y/box){
                            ctx.beginPath();
                            ctx.strokeStyle = "black";
                            ctx.lineWidth = lineWidth;
                            ctx.moveTo(x*box, y*box + box);
                            ctx.lineTo((x+1)*box, y*box + box);
                            ctx.stroke();
                        }
                    }
                    //create correct line for the snake tail
                    if(snake.length > 1 && x == snake[snake.length - 1].x/box && y == snake[snake.length - 1].y/box){
                        if(x + 1 != snake[snake.length - 2].x/box){
                            ctx.beginPath();
                            ctx.strokeStyle = "black";
                            ctx.lineWidth = lineWidth;
                            ctx.moveTo(x*box + box, y*box);
                            ctx.lineTo(x*box + box, (y+1)*box);
                            ctx.stroke();
                        }
                        if(y + 1 != snake[snake.length - 2].y/box){
                            ctx.beginPath();
                            ctx.strokeStyle = "black";
                            ctx.lineWidth = lineWidth;
                            ctx.moveTo(x*box, y*box + box);
                            ctx.lineTo((x+1)*box, y*box + box);
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        ctx.strokeStyle = snakeColor;
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, (defaultSize.x)*box, (defaultSize.y)*box);

    //old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    let snakeTracksX = snakeTracks[0].x;
    let snakeTracksY = snakeTracks[0].y;
    
    //enable arrow keys with play mode
    if(mode == 0){
        d = direction;
        if(d == "LEFT") snakeX -= box;
        if(d == "UP") snakeY -= box;
        if(d == "RIGHT") snakeX += box;
        if(d == "DOWN") snakeY += box;
    }

    //AI MODE 1
    if(mode == 1){
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
if(mode == 2 || mode == 3){

    var reverse = false;

    if(mode == 3 && score >= 1){
        reverse = true;
    }

    //make world
    var world = [[]];


    //find spots
    for(var x = 0; x < (defaultSize.x)*box; x+=box){
        world[x] = [];
        for(var y = 0; y < (defaultSize.y)*box; y+=box){
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
            if( x >= 0 && x < (defaultSize.x)*box && y >= 0 && y < (defaultSize.y)*box){
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


    //fill snake tracks
    if (reverse){
        for(var i = 1; i < snakeTracks.length; i++){
            world[snakeTracks[i].x][snakeTracks[i].y] = 1;
        }
    }

    // find open spots
    fill(world, snake[0].x, snake[0].y, 0);


    //fill escape route
     //escape route for snake
     var escapeRoute = [];
     var escapeEnd = [food.x, food.y];
     var escapeFix = false;
 
     if(reverse && score >= 1 && panic == false && world[food.x][food.y] == 0){
         reverse = false;
         escapeFix = true;
 
            
            escapeRoute = findPath(world, escapeStart, escapeEnd);

            for(var i = 1; i < escapeRoute.length - 1; i++){

                if(snakeX == escapeRoute[i][0] && snakeY == escapeRoute[i][1]){
                    snakeOnLine = true;
                    break;
                }
            
            }

            //score <= 100 ||

            if(snake[snake.length - 1].x == escapeRoute[0][0] && snake[snake.length - 1].y == escapeRoute[0][1] && (score <= 50 || pathGone == true)){
                modeSwitch = true;
            }
            
            for(var i = 1; i < escapeRoute.length - 1; i++){

                if(pathGone == false && !snakeOnLine){
                    world[escapeRoute[i][0]][escapeRoute[i][1]] = 1;
                }
                if(snakeVision.checked == true){
                    ctx.fillStyle = 'rgba(0,0,0,.05)';
                    ctx.fillRect(escapeRoute[i][0], escapeRoute[i][1], box, box);
                }
            }


            fill(world, snake[0].x, snake[0].y, 7);


            if(world[food.x][food.y] != 7){
                for(var i = 1; i < escapeRoute.length - 1; i++){
                    world[escapeRoute[i][0]][escapeRoute[i][1]] = 0;
                    pathGone = true;
                }
            }

            else if(!snakeOnLine && world[food.x][food.y] == 7){
                pathGone = false;
            }

            for(var x = 0; x < (defaultSize.x)*box; x+=box){
                for(var y = 0; y < (defaultSize.y)*box; y+=box){
                    if(world[x][y] == 7){
                        world[x][y] = 0;
                    }
                }
            } 


         
         snakeOnLine = false;
         escapeFix = false;
         reverse = true;
     }

     for(var i = 1; i < snake.length; i++){
        world[snake[i].x][snake[i].y] = 1;
    }

    if(world[food.x][food.y] != 0){
        modeSwitch == true;
    }
    if(modeSwitch == true){


        for(var i = 0; i < escapeRoute.length; i++){
            world[escapeRoute[i][0]][escapeRoute[i][1]] = 0;
        }
        for(var i = 1; i < snake.length; i++){
            world[snake[i].x][snake[i].y] = 1;
        }


        mode = 2;
    }


    //check if the snake enclosed itself
    var checkIfDead = 0;
    for(var x = 0; x < (defaultSize.x)*box; x+=box){
        for(var y = 0; y < (defaultSize.y)*box; y+=box){
            if(world[x][y] == 0){
                checkIfDead++;
            }
        }
    }
    if(checkIfDead == 1){
        

        if(mute.checked == false) die.play();
        clearInterval(game);
        //resetGame();
    }

    //255,105,180,.09
    //highlight selected path
    for(var x = 0; x < (defaultSize.x)*box; x+=box){
        for(var y = 0; y < (defaultSize.y)*box; y+=box){
            if(snakeVision.checked == true){
                world[snake[0].x][snake[0].y] = 4;
                if(world[x][y] == 0){
                    ctx.fillStyle = 'rgba(0,0,255,.09)';
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
    world[snakeTracks[0].x][snakeTracks[0].y] = 0;

    //start of path
    var pathStart = [snake[0].x, snake[0].y];

    //end of path
    if(world[food.x][food.y] == 0){
        panic = false;
        var pathEnd = [food.x, food.y];
    }

    //old panic mode
    else {


        panic = true;
        var randomVisiblePoint = {
            x : Math.floor(Math.random()*(defaultSize.x))*box,
            y : Math.floor(Math.random()*(defaultSize.y))*box
        }

        while(world[randomVisiblePoint.x][randomVisiblePoint.y] != 0){
            randomVisiblePoint.x = Math.floor(Math.random()*(defaultSize.x))*box;
            randomVisiblePoint.y = Math.floor(Math.random()*(defaultSize.y))*box;
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


    for(rp = 1; rp < currentPath.length; rp++){
        if(snakeVision.checked == true){
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.fillRect(currentPath[rp][0], currentPath[rp][1], box, box);
        }
    }


    
        //UP
        if(currentPath[1][1] < snake[0].y && currentPath[1][0] == snake[0].x){
        snakeY -= box;
        snakeTracksY -= box;
        current_direction = "up";
        }
        //DOWN
        if(currentPath[1][1] > snake[0].y && currentPath[1][0] == snake[0].x){
        snakeY += box;
        snakeTracksY += box;
        current_direction = "down";
        }
        //RIGHT
        if(currentPath[1][1] == snake[0].y && currentPath[1][0] > snake[0].x){
        snakeX += box;
        snakeTracksX += box;
        current_direction = "right";
    
        }
        //LEFT
        if(currentPath[1][1] == snake[0].y && currentPath[1][0] < snake[0].x){
        snakeX -= box;
        snakeTracksX -= box;
        current_direction = "left";
        }
    
    function findPath(world, pathStart, pathEnd){
        // math short cuts
        var abs = Math.abs;
        var max = Math.max;
        var pow = Math.pow;
        var sqrt = Math.sqrt;

        // max traverses
        var maxTraversable = 0;

        //dimensions;
        var worldWidth = (defaultSize.x)*box;
        var worldHeight = (defaultSize.y)*box;
        var worldSize = worldWidth * worldHeight;
        
        var distance;

        if(reverse){
            distance = EuclideanDistance;
        }
        else{
            distance = ManhattanDistance;
        }

        var findNeighbours = function(){};

        //mathattan distance formula
        function ManhattanDistance(point, goal){
            return abs(point.x - goal.x) + abs(point.y - goal.y);
        }

        //euclidean distance
        function EuclideanDistance(point, goal){
            return sqrt(pow(point.x - goal.x, 2) + pow(point.y - goal.y, 2));
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
            if(escapeFix == false){
                return ((world[x] != null) && (world[x][y] != null) && (world[x][y] <= maxTraversable));
            }
            else{
                return ((world[x] != null) && (world[x][y] != null) && (world[x][y] <= 3));
            }
        
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
                    if(reverse){
                        if(Open[i].f > min){

                            min = Open[i].f;
                            
                            max = i;    
        
                        }
                    } 
                    else{
                        if(Open[i].f < max){

                            max = Open[i].f;
                            
                            min = i;
                        }
                    }
                }
            
                if(reverse){
                    myNode =  Open.splice(max, 1)[0];
                }
                else{
                    myNode =  Open.splice(min, 1)[0];
                }

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
if(mode == 4){

    if(sum == 330){
        sum = 0
    }
    snakeX = hamCycle2[sum][0];
    snakeY = hamCycle2[sum][1];
    sum++;
  
}
//Hamiltonian Cycle
if(mode == 5){

    
    var apple_pos = hamCycle2Nums[food.y/box][food.x/box];
    var head_pos = hamCycle2Nums[snake[0].y/box][snake[0].x/box];
    var tail_pos = hamCycle2Nums[snake[snake.length-1].y/box][snake[snake.length-1].x/box];

    
    if(head_pos == 329){
        next_hamilton = 0;
    }
    else{
        next_hamilton = head_pos + 1;
    }

    
    //make world
    var world = [[]];


    //find spots
    for(var x = 0; x < (defaultSize.x)*box; x+=box){
        world[x] = [];
        for(var y = 0; y < (defaultSize.y)*box; y+=box){
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
            if( x >= 0 && x < (defaultSize.x)*box && y >= 0 && y < (defaultSize.y)*box){
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


    // find open spots
    fill(world, snake[0].x, snake[0].y, 0);

    if(world[food.x][food.y] != 0){
        panic = true
    }
    else{
        panic = false;
    }


     var escapeFix = false;
 

     for(var i = 1; i < snake.length; i++){
        world[snake[i].x][snake[i].y] = 1;
    }

    if(world[food.x][food.y] != 0){
        panic = true
    }
    else{
        panic = false;
    }

    //check if the snake enclosed itself
    var checkIfDead = 0;
    for(var x = 0; x < (defaultSize.x)*box; x+=box){
        for(var y = 0; y < (defaultSize.y)*box; y+=box){
            if(world[x][y] == 0){
                checkIfDead++;
            }
        }
    }
    if(checkIfDead == 1){
        if(mute.checked == false) die.play();
        clearInterval(game);
        //resetGame();
    }

    //255,105,180,.09
    //highlight selected path
    for(var x = 0; x < (defaultSize.x)*box; x+=box){
        for(var y = 0; y < (defaultSize.y)*box; y+=box){
            if(snakeVision.checked == true){
                world[snake[0].x][snake[0].y] = 4;
                if(world[x][y] == 0){
                    ctx.fillStyle = 'rgba(0,0,255,.09)';
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
    //world[snakeTracks[0].x][snakeTracks[0].y] = 0;

    //start of path
    var pathStart = [snake[0].x, snake[0].y];

    // //end of path
    if(world[food.x][food.y] == 0){
        panic = false;
        var pathEnd = [food.x, food.y];
    }


    if(panic == false && score < 327){
        //var pathEnd = [food.x, food.y];

        //current point of path
        var currentPath = [];

        // begin algorithm  to find shortest path

            while(currentPath.length == 0){
                if(world[pathStart[0]][pathStart[1]] == 0){
                    currentPath = findPath(world, pathStart, pathEnd);
                }
            }


            for(rp = 1; rp < currentPath.length; rp++){
                if(snakeVision.checked == true){
                        ctx.fillStyle = 'rgba(255,255,255,0.15)';
                        ctx.fillRect(currentPath[rp][0], currentPath[rp][1], box, box);
                }
            }

        var next_shortest = hamCycle2Nums[currentPath[1][1]/box][currentPath[1][0]/box];

        var takeShortest = false;

        var iterator = next_hamilton;

        for(var i = 0; i < 330; i++){
            if (iterator == next_shortest){
                takeShortest = true;
                break;
            }
            else if(iterator == tail_pos){
                takeShortest = false;
                break;
            }
            else if(iterator == apple_pos){
                takeShortest = false;
                break;
            }
            else{
                iterator++;
                if(iterator == 330){
                    iterator == 0;
                }
            }
        }
    }
    if(takeShortest == true && panic == false && score < 180){
        snakeX = hamCycle2[next_shortest][0];
        snakeY = hamCycle2[next_shortest][1];
    }
    else{
        snakeX = hamCycle2[next_hamilton][0];
        snakeY = hamCycle2[next_hamilton][1];
    }
    
    
  
    
    function findPath(world, pathStart, pathEnd){
        // math short cuts
        var abs = Math.abs;
        var max = Math.max;
        var pow = Math.pow;
        var sqrt = Math.sqrt;

        // max traverses
        var maxTraversable = 0;

        //dimensions;
        var worldWidth = (defaultSize.x)*box;
        var worldHeight = (defaultSize.y)*box;
        var worldSize = worldWidth * worldHeight;
        
        var distance;

        if(reverse){
            distance = EuclideanDistance;
        }
        else{
            distance = EuclideanDistance;
        }

        var findNeighbours = function(){};

        //mathattan distance formula
        function ManhattanDistance(point, goal){
            return abs(point.x - goal.x) + abs(point.y - goal.y);
        }

        //euclidean distance
        function EuclideanDistance(point, goal){
            return sqrt(pow(point.x - goal.x, 2) + pow(point.y - goal.y, 2));
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
            if(escapeFix == false){
                return ((world[x] != null) && (world[x][y] != null) && (world[x][y] <= maxTraversable));
            }
            else{
                return ((world[x] != null) && (world[x][y] != null) && (world[x][y] <= 3));
            }
        
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
                    if(reverse){
                        if(Open[i].f > min){

                            min = Open[i].f;
                            
                            max = i;    
        
                        }
                    } 
                    else{
                        if(Open[i].f < max){

                            max = Open[i].f;
                            
                            min = i;
                        }
                    }
                }
            
                if(reverse){
                    myNode =  Open.splice(max, 1)[0];
                }
                else{
                    myNode =  Open.splice(min, 1)[0];
                }

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
                x : Math.floor(Math.random()*(defaultSize.x))*box,
                y : Math.floor(Math.random()*(defaultSize.y))*box
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
        //red apple sound
        if(appleColor == "OrangeRed" && mute.checked == false){
            eat5.play();
        }
        //green apple sound
        else if (appleColor == "Lime" && mute.checked == false){
            eat4.play();
        }
        //blue apple sound
        else if (appleColor == "DeepSkyBlue" && mute.checked == false){
            eat2.play();
        }
        //purple apple sound
        else if (appleColor == "Magenta" && mute.checked == false){
            eat3.play();
        }
        //white apple sound
        else if(mute.checked == false){
            eat1.play();
        }

        pathGone = false;
        
        if(modeSwitch == true){
            mode = 3;
            modeSwitch = false;
        }

        snakeTracks = [];
        escapeRoute = [];

        
        escapeStart = escapeEnd;
       
        if(score > 326){
            firstloop:
                for(var x = 0; x < (defaultSize.x); x++){
                    for(var y = 0; y < (defaultSize.y); y++){
                        for(var i = 0; i < snake.length; i++){
                            if(x != snake[i].x/box && y != snake[i].y/box){
                                food = {
                                    x : x*box,
                                    y : y*box
                                }
                                break firstloop;
                            }
                        }
                    }
                }
        }
        else{
            spawnFood();
        }
        coloredAppleChance = Math.floor(Math.random()*100) + 1;
        whichApple = Math.floor(Math.random()*4) + 1;
        snakeColor = appleColor;
        headColor = appleColor2;
        
    }
    else{
        snake.pop(); //remove tail 
        // snakeTracks.pop();
    }

    // add head

    let newHead = {
        x : snakeX,
        y : snakeY
    }

    let newHead2 = {
        x : snakeTracksX,
        y : snakeTracksY
    }
    // end game

    if(snakeX < 0 || snakeX >= (defaultSize.x) * box || snakeY >= (defaultSize.y) * box || snakeY < 0 || collision(newHead, snake)){
        clearInterval(game);

        if(mute.checked == false) die.play();
    }

    snake.unshift(newHead);
    snakeTracks.unshift(newHead2);

    //scoreboard 100 10 100 100
    sb.fillStyle = "black";
    sb.fillRect(100, 10, 150, 100)
    sb.fillStyle = "white";
    sb.font = "40px Poppin";
    sb.drawImage(logo, 40, 0)
    sb.fillText(" : ", 95, 40);
    if(max == true){
        sb.fillText("MAX", 130, 43);
    }
    else{
        sb.fillText(score, 130, 43); //150
    }
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
var aiMode3 = document.getElementById("ai3");
var aiMode4 = document.getElementById("ai4");
var aiMode5 = document.getElementById("ai5");

function changeSpeed(){

    if(defaultSpeed.checked == true && (aiMode3.checked == true || aiMode4.checked == true || aiMode5.checked == true)){
        speed = 35; //15
    }
    else if(defaultSpeed.checked == true){
        speed = 65;
    }
    else if(slowSpeed.checked == true && (aiMode3.checked == true || aiMode4.checked == true || aiMode5.checked == true)){
        speed = 50;
    }
    else if(slowSpeed.checked == true){
        speed = 100;
    }
    else if(fastSpeed.checked == true && (aiMode3.checked == true || aiMode4.checked == true || aiMode5.checked == true)){
        speed = 15;
    }
    else if(fastSpeed.checked == true){
        speed = 35;
    }
    else if(ultraSpeed.checked == true && (aiMode3.checked == true || aiMode4.checked == true || aiMode5.checked == true)){
        speed = .0001;
    }
    else if(ultraSpeed.checked == true){
        speed = 15;
    }
}

function changeMode(){
    if(playMode.checked == true){
        mode = 0;
    }
    else if(aiMode.checked == true){
        mode = 1;
    }
    else if(aiMode2.checked == true){
        mode = 2;
    }
    else if(aiMode3.checked == true){
        mode = 3;
    }
    else if(aiMode4.checked == true){
        mode = 4;
    }
    else if(aiMode5.checked == true){
        mode = 5;
    }
}

function resetGame(){
    sum = 0;
    snakeColor = "white";
    headColor = "white";
    panic = false;
    changeSpeed();
    changeMode();
    clearInterval(game);
    hamilton = true;
    score = 0;
    direction = 0;
    snake.length = 1;
    modeSwitch = false;
    max = false;

    if(aiMode2.checked == true || aiMode3.checked == true){
        
        snakeTracks.length = 1;
        snakeTracks[0] = {
            x : (defaultSize.xh)*box,
            y : (defaultSize.yh)*box
        };
    }
    snake[0] = {
        x : (defaultSize.xh)*box, 
        y : (defaultSize.yh)*box
    };
    food = {
        x : Math.floor(Math.random()*(defaultSize.x))*box,
        y : Math.floor(Math.random()*(defaultSize.y))*box
    }
    game = setInterval(draw, speed);
}
