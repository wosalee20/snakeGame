// Define constants for direction
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

// Get the canvas and context, and other necessary elements
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const upBtn = document.querySelector("#upBtn");
const leftBtn = document.querySelector("#leftBtn");
const rightBtn = document.querySelector("#rightBtn");
const downBtn = document.querySelector("#downBtn");

// Define constants for drawing
const boardBackground = "yellow";
const snakeColor = "black";
const snakeBoarder = "white";
const foodColor = "green";
const unitSize = 25;

// Initialize game variables
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
];

// Add event listeners
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
upBtn.addEventListener("click", () => changeDirectionByKey(UP));
leftBtn.addEventListener("click", () => changeDirectionByKey(LEFT));
rightBtn.addEventListener("click", () => changeDirectionByKey(RIGHT));
downBtn.addEventListener("click", () => changeDirectionByKey(DOWN));

// Start the game
gameStart();

// Function to start the game
function gameStart() {
    running = true;
    document.querySelector(".die-sound").pause();
    document.querySelector(".background-sound").play();
    document.querySelector(".background-sound").volume = 0.1;
    scoreText.textContent = `Score: ${score}`;
    createFood();
    drawFood();
    nextTick();
}

// Main game loop
function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 80);
    } else {
        displayGameOver();
    }
}

// Clear the game board
function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

// Create random food coordinates
function createFood() {
    function randomFood(min, max) {
        const randNum =
            Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}

// Draw the food on the canvas
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);
    // Check if food was eaten
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 5 * 1;
        scoreText.textContent = `Score: ${score}`;
        document.querySelector(".eat-sound").play();
        createFood();
    } else {
        snake.pop();
    }
}

// Draw the snake on the canvas
function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBoarder;
    snake.forEach((snakePart) => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

// Change the snake's direction based on user input
function changeDirection(event) {
    const keyPressed = event.keyCode;

    switch (true) {
        case keyPressed === LEFT && xVelocity !== unitSize:
            xVelocity = -unitSize;
            yVelocity = 0;
            break;

        case keyPressed === UP && yVelocity !== unitSize:
            xVelocity = 0;
            yVelocity = -unitSize;
            break;

        case keyPressed === RIGHT && xVelocity !== -unitSize:
            xVelocity = unitSize;
            yVelocity = 0;
            break;

        case keyPressed === DOWN && yVelocity !== -unitSize:
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

// Change the snake's direction based on button click
function changeDirectionByKey(keyPressed) {
    const goingUP = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingRight = xVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;

    switch (keyPressed) {
        case LEFT:
            if (!goingRight) {
                xVelocity = -unitSize;
                yVelocity = 0;
            }
            break;

        case UP:
            if (!goingDown) {
                xVelocity = 0;
                yVelocity = -unitSize;
            }
            break;
        case RIGHT:
            if (!goingLeft) {
                xVelocity = unitSize;
                yVelocity = 0;
            }
            break;

        case DOWN:
            if (!goingUP) {
                xVelocity = 0;
                yVelocity = unitSize;
            }
            break;
    }
}

// Check if the game is over
function checkGameOver() {
    switch (true) {
        case snake[0].x < 0:
        case snake[0].x >= gameWidth:
        case snake[0].y < 0:
        case snake[0].y >= gameHeight:
            running = false;
            break;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
    }
}

// Display the game over message
function displayGameOver() {
    document.querySelector(".background-sound").pause();
    document.querySelector(".die-sound").play();
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
}

// Reset the game
function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 },
    ];
    gameStart();
}
