const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameOverText = document.getElementById('gameOverText');
const restartButton = document.getElementById('restartButton');

const playerWidth = 50;
const playerHeight = 20;
const playerSpeed = 7;

let player = {
    x: canvas.width / 2 - playerWidth / 2,
    y: canvas.height - playerHeight - 10,
    width: playerWidth,
    height: playerHeight,
    speed: playerSpeed,
    dx: 0
};

const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 7;
let bullets = [];

const alienRowCount = 3;
const alienColumnCount = 8;
const alienWidth = 40;
const alienHeight = 30;
const alienPadding = 20;
const alienOffsetTop = 30;
const alienOffsetLeft = 30;
const alienSpeed = 2;

let aliens = [];
let direction = 1;

for (let row = 0; row < alienRowCount; row++) {
    aliens[row] = [];
    for (let col = 0; col < alienColumnCount; col++) {
        aliens[row][col] = {
            x: col * (alienWidth + alienPadding) + alienOffsetLeft,
            y: row * (alienHeight + alienPadding) + alienOffsetTop,
            width: alienWidth,
            height: alienHeight,
            status: 1
        };
    }
}

let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ') {
        spacePressed = true;
        shootBullet();
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (e.key === ' ') {
        spacePressed = false;
    }
}

function movePlayer() {
    if (rightPressed) {
        player.dx = player.speed;
    } else if (leftPressed) {
        player.dx = -player.speed;
    } else {
        player.dx = 0;
    }

    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - bulletWidth / 2,
        y: player.y,
        width: bulletWidth,
        height: bulletHeight,
        dy: -bulletSpeed
    });
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y += bullet.dy;

        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function drawPlayer() {
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawAliens() {
    aliens.forEach(row => {
        row.forEach(alien => {
            if (alien.status === 1) {
                ctx.fillStyle = 'red';
                ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
            }
        });
    });
}

function moveAliens() {
    let edgeReached = false;

    aliens.forEach(row => {
        row.forEach(alien => {
            if (alien.status === 1) {
                alien.x += alienSpeed * direction;

                if (alien.x + alien.width > canvas.width || alien.x < 0) {
                    edgeReached = true;
                }
            }
        });
    });

    if (edgeReached) {
        direction *= -1;
        aliens.forEach(row => {
            row.forEach(alien => {
                alien.y += alienHeight;
            });
        });
    }
}

function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        aliens.forEach(row => {
            row.forEach((alien, aIndex) => {
                if (
                    alien.status === 1 &&
                    bullet.x < alien.x + alien.width &&
                    bullet.x + bullet.width > alien.x &&
                    bullet.y < alien.y + alien.height &&
                    bullet.y + bullet.height > alien.y
                ) {
                    alien.status = 0;
                    bullets.splice(bIndex, 1);
                }
            });
        });
    });

    aliens.forEach(row => {
        row.forEach(alien => {
            if (
                alien.status === 1 &&
                alien.y + alien.height > player.y &&
                alien.x < player.x + player.width &&
                alien.x + alien.width > player.x
            ) {
                gameOver();
            }
        });
    });
}

function gameOver() {
    cancelAnimationFrame(animationId);
    gameOverText.style.display = 'block';
    gameOverText.textContent = 'Game Over! Press Restart to play again.';
}

function restart() {
    player.x = canvas.width / 2 - playerWidth / 2;
    player.y = canvas.height - playerHeight - 10;
    bullets = [];
    aliens = [];

    for (let row = 0; row < alienRowCount; row++) {
        aliens[row] = [];
        for (let col = 0; col < alienColumnCount; col++) {
            aliens[row][col] = {
                x: col * (alienWidth + alienPadding) + alienOffsetLeft,
                y: row * (alienHeight + alienPadding) + alienOffsetTop,
                width: alienWidth,
                height: alienHeight,
                status: 1
            };
        }
    }

    gameOverText.style.display = 'none';
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    drawAliens();

    movePlayer();
    moveBullets();
    moveAliens();
    checkCollisions();

    if (!gameOverText.style.display) {
        animationId = requestAnimationFrame(animate);
    }
}

restartButton.addEventListener('click', restart);

let animationId = requestAnimationFrame(animate);
