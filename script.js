// Variables to control game state

let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let score = 0;
let timeLeft = 30;
let timerInterval = null;

// Difficulty settings
const difficultySettings = {
  easy:    { time: 40, winScore: 15, dropInterval: 1200 },
  normal:  { time: 30, winScore: 20, dropInterval: 1000 },
  hard:    { time: 20, winScore: 23, dropInterval: 700 }
};
let currentDifficulty = 'normal';
let winScore = difficultySettings.normal.winScore;
let dropIntervalMs = difficultySettings.normal.dropInterval;

// Wait for button click to start the game

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const difficultySelect = document.getElementById("difficulty");

// Listen for difficulty changes
difficultySelect.addEventListener("change", function() {
  currentDifficulty = this.value;
  // Optionally update UI or reset game here
});

document.getElementById("start-btn").addEventListener("click", startGame);

const winningMessages = [
  "Amazing! You made a splash for clean water!",
  "You’re a water hero!",
  "You caught enough drops—well done!",
  "Charity: water thanks you for your impact!"
];
const losingMessages = [
  "Try again! Every drop counts.",
  "Keep going—clean water needs you!",
  "Almost there! Give it another shot.",
  "Don’t give up—water is life!"
];

// Add charity: water logo to the top of the game
const logoUrl = "img/Screenshot 2025-10-14 at 6.17.49 PM.png";
const gameWrapper = document.querySelector('.game-wrapper');
const logoImg = document.createElement('img');
logoImg.src = logoUrl;
logoImg.alt = "charity: water logo";
logoImg.className = "cw-logo";
gameWrapper.insertBefore(logoImg, gameWrapper.firstChild);


function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  // Set difficulty-based parameters
  const settings = difficultySettings[currentDifficulty] || difficultySettings.normal;
  timeLeft = settings.time;
  winScore = settings.winScore;
  dropIntervalMs = settings.dropInterval;

  gameRunning = true;
  score = 0;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  startBtn.disabled = true;
  gameContainer.innerHTML = '';
  document.querySelectorAll('.end-message').forEach(e => e.remove());

  timerInterval = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  // Create new drops at difficulty-based interval
  dropMaker = setInterval(createDrop, dropIntervalMs);
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });

  // Update score when drop is clicked
  drop.addEventListener("click", () => {
    if (!gameRunning) return;
    score++;
    scoreEl.textContent = score;
    drop.remove();
  });
}


function endGame() {
  gameRunning = false;
  clearInterval(timerInterval);
  clearInterval(dropMaker);
  startBtn.disabled = false;
  // Remove only drops, not the whole container
  const drops = gameContainer.querySelectorAll('.water-drop, .bad-drop');
  drops.forEach(drop => drop.remove());
  let msgArr = score >= winScore ? winningMessages : losingMessages;
  let msg = msgArr[Math.floor(Math.random() * msgArr.length)];
  const endMsg = document.createElement('div');
  endMsg.className = 'end-message';
  endMsg.textContent = msg + ` (Score: ${score} / ${winScore})`;
  gameContainer.appendChild(endMsg);
}
