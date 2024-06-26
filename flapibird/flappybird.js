const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = { x: 50, y: 150, width: 20, height: 20 };
let gravity = 0.25; // Ajust de la gravetat per a una caiguda més suau
let lift = -6;
let velocity = 0;
let pipes = [];
let frameCount = 0;
let score = 0;
const gap = 150; // Augmenta la separació entre els tubs
const pipeWidth = 20;
const pipeSpeed = 2; // Velocitat constant de les canonades
let isGameStarted = false;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        velocity = lift;
        if (!isGameStarted) {
            isGameStarted = true;
            setTimeout(loop, 2000); // Retard de 2 segons abans de començar el joc
        }
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
    isGameStarted = false;
    document.getElementById('gameOverText').textContent = '';
    document.getElementById('score').textContent = 'Score: ' + score;
    loop(); // Comença el joc immediatament sense retard
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

    if (frameCount % 100 === 0) { // Augmenta la separació temporal entre les canonades
        let pipeHeight = Math.floor(Math.random() * (canvas.height - gap));
        pipes.push({ x: canvas.width, y: pipeHeight });
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed; // Utilitza la velocitat constant

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
