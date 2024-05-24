const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverText = document.getElementById('gameOverText');
const scoreText = document.getElementById('score');

const box = 20;
const canvasSize = 20;
const canvasWidth = canvas.width / box;
const canvasHeight = canvas.height / box;

let snake;
let direction;
let food;
let score;
let game;

function init() {
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    direction = null;
    score = 0;
    food = {
        x: Math.floor(Math.random() * canvasWidth) * box,
        y: Math.floor(Math.random() * canvasHeight) * box
    };
    gameOverText.textContent = '';
    scoreText.textContent = 'Score: ' + score;
    if (game) clearInterval(game);
    game = setInterval(draw, 100);
}

document.addEventListener('keydown', setDirection);

function setDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    } else if (event.keyCode === 82) { // tecla 'R'
        init();
    }
}

function collision(newHead, snakeArray) {
    for (let i = 0; i < snakeArray.length; i++) {
        if (newHead.x === snakeArray[i].x && newHead.y === snakeArray[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * canvasWidth) * box,
            y: Math.floor(Math.random() * canvasHeight) * box
        };
        score++;
        scoreText.textContent = 'Score: ' + score;
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        gameOverText.textContent = 'Game Over! Press R to Restart.';
    }

    snake.unshift(newHead);
}

init();
