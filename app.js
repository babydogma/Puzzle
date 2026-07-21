const board = document.getElementById("board");
const difficultySelect = document.getElementById("difficulty");
const newPuzzleBtn = document.getElementById("newPuzzleBtn");

const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");

const loadingEl = document.getElementById("loading");

const winModal = document.getElementById("winModal");
const finalTime = document.getElementById("finalTime");
const finalMoves = document.getElementById("finalMoves");
const playAgainBtn = document.getElementById("playAgainBtn");

let size = 3;
let tiles = [];
let moves = 0;

let seconds = 0;
let timerInterval = null;

let emptyIndex = 0;
let imageUrl = "";

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        seconds++;

        const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");

        timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);

    seconds = 0;
    timerEl.textContent = "00:00";
}

function resetMoves() {
    moves = 0;
    movesEl.textContent = "0";
}

function updateMoves() {
    moves++;
    movesEl.textContent = moves;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
        [array[j], array[i]];
    }

    return array;
}

function getRandomImage() {

    return `https://picsum.photos/800?random=${Date.now()}`;

}

async function createPuzzle() {

    loadingEl.classList.remove("hidden");

    board.innerHTML = "";

    size = Number(difficultySelect.value);

    board.style.gridTemplateColumns =
        `repeat(${size}, 1fr)`;

    imageUrl = getRandomImage();

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.src = imageUrl;

    await new Promise((resolve, reject) => {

        img.onload = resolve;
        img.onerror = reject;

    });

    tiles = [];

    const totalTiles = size * size;

    for (let i = 0; i < totalTiles - 1; i++) {
        tiles.push(i);
    }

    tiles.push("empty");

    shuffle(tiles);

    emptyIndex = tiles.indexOf("empty");

    renderBoard(img);

    loadingEl.classList.add("hidden");
}

function renderBoard(img) {

    board.innerHTML = "";

    const pieceWidth = img.width / size;
    const pieceHeight = img.height / size;

    tiles.forEach((value, index) => {

        const tile = document.createElement("div");

        tile.classList.add("tile");

        tile.dataset.index = index;

        if (value === "empty") {

            tile.classList.add("empty");

            board.appendChild(tile);

            return;
        }

        const originalRow =
            Math.floor(value / size);

        const originalCol =
            value % size;

        tile.style.backgroundImage =
            `url(${imageUrl})`;

        tile.style.backgroundSize =
            `${size * 100}% ${size * 100}%`;

        tile.style.backgroundPosition =
            `${(originalCol * 100) / (size - 1)}% ${(originalRow * 100) / (size - 1)}%`;

        tile.dataset.value = value;

        tile.addEventListener(
            "click",
            () => moveTile(index)
        );

        board.appendChild(tile);

    });

}

function isAdjacent(index1, index2) {

    const row1 = Math.floor(index1 / size);
    const col1 = index1 % size;

    const row2 = Math.floor(index2 / size);
    const col2 = index2 % size;

    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);

    return rowDiff + colDiff === 1;
}

function moveTile(index) {

    if (!isAdjacent(index, emptyIndex)) {
        return;
    }

    [tiles[index], tiles[emptyIndex]] =
    [tiles[emptyIndex], tiles[index]];

    emptyIndex = index;

    updateMoves();

    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {

        renderBoard(img);

        if (checkWin()) {

            clearInterval(timerInterval);

            finalTime.textContent =
                timerEl.textContent;

            finalMoves.textContent =
                moves;

            winModal.classList.remove(
                "hidden"
            );
        }
    };
}

function checkWin() {

    const totalTiles =
        size * size;

    for (
        let i = 0;
        i < totalTiles - 1;
        i++
    ) {

        if (tiles[i] !== i) {
            return false;
        }
    }

    return (
        tiles[totalTiles - 1]
        === "empty"
    );
}

async function startGame() {

    resetTimer();

    resetMoves();

    await createPuzzle();

    startTimer();
}

newPuzzleBtn.addEventListener(
    "click",
    () => {

        winModal.classList.add(
            "hidden"
        );

        startGame();
    }
);

playAgainBtn.addEventListener(
    "click",
    () => {

        winModal.classList.add(
            "hidden"
        );

        startGame();
    }
);

window.addEventListener(
    "load",
    () => {

        startGame();
    }
);
