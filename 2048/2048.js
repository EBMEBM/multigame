const gameBoard = document.getElementById('game-board');
const gameOverText = document.getElementById('game-over-text');
const restartButton = document.getElementById('restart-button');

let board;
let score;

const initializeGame = () => {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    gameOverText.style.display = 'none';
    addNewTile();
    addNewTile();
    drawBoard();
};

const drawBoard = () => {
    gameBoard.innerHTML = '';
    board.forEach(row => {
        row.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile');
            if (tile > 0) {
                tileElement.textContent = tile;
                tileElement.classList.add(`tile-${tile}`);
            }
            gameBoard.appendChild(tileElement);
        });
    });
};

const addNewTile = () => {
    let emptyTiles = [];
    board.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile === 0) {
                emptyTiles.push({ row: rowIndex, col: colIndex });
            }
        });
    });

    if (emptyTiles.length > 0) {
        let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[randomTile.row][randomTile.col] = Math.random() > 0.1 ? 2 : 4;
    }
};

const moveLeft = () => {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        let newRow = board[row].filter(tile => tile !== 0);
        while (newRow.length < 4) newRow.push(0);
        for (let col = 0; col < 4; col++) {
            if (board[row][col] !== newRow[col]) moved = true;
            board[row][col] = newRow[col];
        }
    }
    return moved;
};

const moveRight = () => {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        let newRow = board[row].filter(tile => tile !== 0);
        while (newRow.length < 4) newRow.unshift(0);
        for (let col = 0; col < 4; col++) {
            if (board[row][col] !== newRow[col]) moved = true;
            board[row][col] = newRow[col];
        }
    }
    return moved;
};

const moveUp = () => {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let newCol = [];
        for (let row = 0; row < 4; row++) {
            if (board[row][col] !== 0) newCol.push(board[row][col]);
        }
        while (newCol.length < 4) newCol.push(0);
        for (let row = 0; row < 4; row++) {
            if (board[row][col] !== newCol[row]) moved = true;
            board[row][col] = newCol[row];
        }
    }
    return moved;
};

const moveDown = () => {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let newCol = [];
        for (let row = 0; row < 4; row++) {
            if (board[row][col] !== 0) newCol.push(board[row][col]);
        }
        while (newCol.length < 4) newCol.unshift(0);
        for (let row = 0; row < 4; row++) {
            if (board[row][col] !== newCol[row]) moved = true;
            board[row][col] = newCol[row];
        }
    }
    return moved;
};

const combineRow = row => {
    for (let col = 0; col < 3; col++) {
        if (row[col] > 0 && row[col] === row[col + 1]) {
            row[col] *= 2;
            row[col + 1] = 0;
            score += row[col];
        }
    }
    return row;
};

const combineLeft = () => {
    for (let row = 0; row < 4; row++) {
        board[row] = combineRow(board[row]);
    }
};

const combineRight = () => {
    for (let row = 0; row < 4; row++) {
        board[row] = combineRow(board[row].reverse()).reverse();
    }
};

const combineUp = () => {
    for (let col = 0; col < 4; col++) {
        let newCol = [];
        for (let row = 0; row < 4; row++) {
            newCol.push(board[row][col]);
        }
        newCol = combineRow(newCol);
        for (let row = 0; row < 4; row++) {
            board[row][col] = newCol[row];
        }
    }
};

const combineDown = () => {
    for (let col = 0; col < 4; col++) {
        let newCol = [];
        for (let row = 0; row < 4; row++) {
            newCol.push(board[row][col]);
        }
        newCol = combineRow(newCol.reverse()).reverse();
        for (let row = 0; row < 4; row++) {
            board[row][col] = newCol[row];
        }
    }
};

const checkGameOver = () => {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) return false;
            if (col < 3 && board[row][col] === board[row][col + 1]) return false;
            if (row < 3 && board[row][col] === board[row + 1][col]) return false;
        }
    }
    return true;
};

const handleMove = (moveFunction, combineFunction) => {
    if (moveFunction()) {
        combineFunction();
        moveFunction();
        addNewTile();
        drawBoard();
        if (checkGameOver()) {
            gameOverText.style.display = 'block';
            gameOverText.textContent = 'Game Over! Press Restart to play again.';
        }
    }
};

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            handleMove(moveLeft, combineLeft);
            break;
        case 'ArrowRight':
            handleMove(moveRight, combineRight);
            break;
        case 'ArrowUp':
            handleMove(moveUp, combineUp);
            break;
        case 'ArrowDown':
            handleMove(moveDown, combineDown);
            break;
    }
});

restartButton.addEventListener('click', initializeGame);

initializeGame();
