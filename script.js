const grid = document.getElementById("grid");
const restartBtn = document.getElementById("restart-btn");
const currentTurnDisplay = document.getElementById("current-turn");
const difficultySelect = document.getElementById("difficulty-select");

let board = Array(9).fill(null); // Representing the board as a 1D array
let currentPlayer = "X";
let gameActive = true;

// Sound effects
const moveSound = new Audio("move.mp3");
const winSound = new Audio("win.mp3");

// Initialize the grid
function initializeGrid() {
  grid.innerHTML = ""; // Clear the grid
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    grid.appendChild(cell);
  }
}

// Handle cell click event
function handleCellClick(event) {
  const cell = event.target;
  const index = cell.dataset.index;

  if (board[index] || !gameActive) return; // Ignore if cell is already filled or game is over

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  moveSound.play();

  if (checkWin()) {
    gameActive = false;
    highlightWinningCells();
    winSound.play();
    setTimeout(() => alert(`${currentPlayer} wins!`), 100);
    return;
  }

  if (board.every(cell => cell)) {
    gameActive = false;
    alert("It's a draw!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  currentTurnDisplay.textContent = currentPlayer;

  if (currentPlayer === "O" && difficultySelect.value === "hard") {
    setTimeout(aiMove, 500); // AI makes its move
  }
}

// AI move (Easy: Random)
function aiMove() {
  if (!gameActive) return;

  const emptyCells = board.map((val, i) => (val === null ? i : null)).filter(val => val !== null);
  const index = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[index] = "O";
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  cell.textContent = "O";
  moveSound.play();

  if (checkWin()) {
    gameActive = false;
    highlightWinningCells();
    winSound.play();
    setTimeout(() => alert("O wins!"), 100);
    return;
  }

  if (board.every(cell => cell)) {
    gameActive = false;
    alert("It's a draw!");
    return;
  }

  currentPlayer = "X";
  currentTurnDisplay.textContent = currentPlayer;
}

// Check for win
function checkWin() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      combination.forEach(index => {
        document.querySelector(`.cell[data-index='${index}']`).classList.add("winning");
      });
      return true;
    }
    return false;
  });
}

// Highlight winning cells
function highlightWinningCells() {
  const cells = document.querySelectorAll(".cell.winning");
  cells.forEach(cell => {
    cell.classList.add("highlight");
  });
}

// Restart game
restartBtn.addEventListener("click", () => {
  board.fill(null);
  currentPlayer = "X";
  gameActive = true;
  currentTurnDisplay.textContent = currentPlayer;
  initializeGrid();
});

// Initialize game
initializeGrid();