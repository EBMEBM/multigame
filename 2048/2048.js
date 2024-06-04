const gridContainer = document.getElementById('grid-container');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');

let grid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

let score = 0;

document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', restartGame);

function initializeGame() {
    createGrid();
    addNewTile();
    addNewTile();
    updateGrid();
}

function createGrid() {
    gridContainer.innerHTML = '';
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.id = `cell-${row}-${col}`;
            gridContainer.appendChild(cell);
        }
    }
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
    addNewTile();
    updateGrid();
    checkGameOver();
}

function addNewTile() {
    let emptyCells = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateGrid() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let cell = document.getElementById(`cell-${row}-${col}`);
            cell.textContent = grid[row][col] === 0 ? '' : grid[row][col];
            cell.style.backgroundColor = getCellColor(grid[row][col]);
        }
    }
    scoreDisplay.textContent = `Score: ${score}`;
}

function getCellColor(value) {
    switch (value) {
        case 0: return '#cdc1b4';
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#3c3a32';
    }
}

function moveUp() {
    let merged = [false, false, false, false];
    for (let col = 0; col < 4; col++) {
        for (let row = 1; row < 4; row++) {
            if (grid[row][col] !== 0) {
                let newRow = row;
                while (newRow > 0 && grid[newRow - 1][col] === 0) {
                    newRow--;
                }
                if (newRow > 0 && grid[newRow - 1][col] === grid[row][col] && !merged[newRow - 1]) {
                    grid[newRow - 1][col] *= 2;
                    grid[row][col] = 0;
                    merged[newRow - 1] = true;
                    score += grid[newRow - 1][col];
                } else if (newRow !== row) {
                    grid[newRow][col] = grid[row][col];
                    grid[row][col] = 0;
                }
            }
        }
    }
}

function moveDown() {
    let merged = [false, false, false, false];
    for (let col = 0; col < 4; col++) {
        for (let row = 2; row >= 0; row--) {
            if (grid[row][col] !== 0) {
                let newRow = row;
                while (newRow < 3 && grid[newRow + 1][col] === 0) {
                    newRow++;
                }
                if (newRow < 3 && grid[newRow + 1][col] === grid[row][col] && !merged[newRow + 1]) {
                    grid[newRow + 1][col] *= 2;
                    grid[row][col] = 0;
                    merged[newRow + 1] = true;
                    score += grid[newRow + 1][col];
                } else if (newRow !== row) {
                    grid[newRow][col] = grid[row][col];
                    grid[row][col] = 0;
                }
            }
        }
    }
}

function moveLeft() {
    let merged = [false, false, false, false];
    for (let row = 0; row < 4; row++) {
        for (let col = 1; col < 4; col++) {
            if (grid[row][col] !== 0) {
                let newCol = col;
                while (newCol > 0 && grid[row][newCol - 1] === 0) {
                    newCol--;
                }
                if (newCol > 0 && grid[row][newCol - 1] === grid[row][col] && !merged[newCol - 1]) {
                    grid[row][newCol - 1] *= 2;
                    grid[row][col] = 0;
                    merged[newCol - 1] = true;
                    score += grid[row][newCol - 1];
                } else if (newCol !== col) {
                    grid[row][newCol] = grid[row][col];
                    grid[row][col] = 0;
                }
            }
        }
    }
}

function moveRight() {
    let merged = [false, false, false, false];
    for (let row = 0; row < 4; row++) {
        for (let col = 2; col >= 0; col--) {
            if (grid[row][col] !== 0) {
                let newCol = col;
                while (newCol < 3 && grid[row][newCol +
