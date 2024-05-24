const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = { x: 50, y: 150, width: 20, height: 20 };
let gravity = 1.5;
let lift = -15;
let velocity = 0;
let pipes = [];
let frameCount = 0;
let score = 0;
const gap = 100;
const pipeWidth = 20;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        velocity = lift;
    } else if (e.code === 'KeyR') {
        restart();
    }
});

function restart() {
    bird.y = 150;
    velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
    document.getElementById('gameOverText').textContent = '';
    loop();
}

function loop() {
    update();
    draw();
    if (checkGameOver()) {
        document.getElementById('gameOverText').textContent = 'Game Over! Press R to Restart.';
    } else {
        requestAnimationFrame(loop);
    }
}

function update() {
    velocity += gravity;
    bird.y += velocity;

    if (frameCount % 75 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - gap));
        pipes.push({ x: canvas.width, y: pipeHeight });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }

    frameCount++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + gap, pipeWidth, canvas.height - pipe.y - gap);
    });

    document.getElementById('score').textContent = 'Score: ' + score;
}

function checkGameOver() {
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        return true;
    }

    for (let pipe of pipes) {
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + gap)) {
            return true;
        }
    }

    return false;
}

restart();
