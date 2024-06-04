document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const restartButton = document.getElementById('restartButton');
    let grid = [];

    restartButton.addEventListener('click', initializeGame);
    document.addEventListener('keydown', handleKeyPress);

    initializeGame();

    function initializeGame() {
        grid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        addNewTile();
        addNewTile();
        updateGrid();
    }

    function addNewTile() {
        const emptyCells = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        if (emptyCells.length > 0) {
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function updateGrid() {
        gridContainer.innerHTML = '';
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cellValue = grid[row][col];
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = cellValue === 0 ? '' : cellValue;
                cell.style.backgroundColor = getTileColor(cellValue);
                gridContainer.appendChild(cell);
            }
        }
    }

    function getTileColor(value) {
        switch (value) {
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
            default: return '#cdc1b4';
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'ArrowUp') {
            moveUp();
        } else if (event.key === 'ArrowDown') {
            moveDown();
        } else if (event.key === 'ArrowLeft') {
            moveLeft();
        } else if (event.key === 'ArrowRight') {
            moveRight();
        }
        addNewTile();
        updateGrid();
    }

    function moveUp() {
        for (let col = 0; col < 4; col++) {
            let merged = [false, false, false, false];
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
                    } else if (newRow !== row) {
                        grid[newRow][col] = grid[row][col];
                        grid[row][col] = 0;
                    }
                }
            }
        }
    }

    function moveDown() {
        for (let col = 0; col < 4; col++) {
            let merged = [false, false, false, false];
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
                    } else if (newRow !== row) {
                        grid[newRow][col] = grid[row][col];
                        grid[row][col] = 0;
                    }
                }
            }
        }
    }

    function moveLeft() {
        for (let row = 0; row < 4; row++) {
            let merged = [false, false, false, false];
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
                    } else if (newCol !== col) {
                        grid[row][newCol] = grid[row][col];
                        grid[row][col] = 0;
                    }
                }
            }
        }
    }

    function moveRight() {
        for (let row = 0; row < 4; row++) {
            let merged = [false, false, false, false];
            for (let col = 2; col >= 0; col--) {
                if (grid[row][col] !== 0) {
                    let newCol = col;
                    while (newCol < 3 && grid[row][newCol + 1] === 0) {
                        newCol++;
                    }
                    if (newCol < 3 && grid[row][newCol + 1] === grid[row][col] && !merged[newCol + 1]) {
                        grid[row][newCol + 1] *= 2;
                        grid[row][col] = 0;
                        merged[newCol + 1] = true;
                    } else if (newCol !== col) {
                        grid[row][newCol] = grid[row][col];
                        grid[row][col] = 0;
                    }
                }
            }
        }
    }
});
