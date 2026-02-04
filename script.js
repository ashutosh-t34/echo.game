/***********************
  BASIC SETUP
************************/
const game = document.getElementById("game");
const player = document.getElementById("player");
const goal = document.getElementById("goal");

const STEP = 40;
const ECHO_SPAWN_TIME = 2500;
const ECHO_MOVE_TIME = 400;

/***********************
  GAME STATE
************************/
let started = false;
let gameOver = false;

let level = 1;
let score = 0;

let playerPos = { x: 40, y: 40 };
let moveHistory = [];
let echoes = [];

/***********************
  HUD
************************/
const hud = document.createElement("div");
hud.className = "hud";
hud.innerText = "Level: 1 | Score: 0";
game.appendChild(hud);

/***********************
  START SCREEN
************************/
const startScreen = document.createElement("div");
startScreen.className = "start-screen";
startScreen.innerHTML = `
  <h2>ECHO</h2>
  <p>
    Arrow Keys = Move<br>
    Your past moves return as echoes<br>
    Touch an echo = Game Over<br><br>
    Reach the 🏁 to level up
  </p>
  <strong>Press any key to start</strong>
`;
game.appendChild(startScreen);

/***********************
  START GAME
************************/
function startGame() {
  if (started) return;
  started = true;
  startScreen.remove();
}

/***********************
  PLAYER MOVE
************************/
function move(dx, dy) {
  if (!started || gameOver) return;

  const nx = playerPos.x + dx * STEP;
  const ny = playerPos.y + dy * STEP;

  if (
    nx < 0 ||
    ny < 0 ||
    nx + STEP > game.clientWidth ||
    ny + STEP > game.clientHeight
  ) return;

  playerPos = { x: nx, y: ny };
  player.style.left = nx + "px";
  player.style.top = ny + "px";

  moveHistory.push({ dx, dy });
  if (moveHistory.length > 25) moveHistory.shift();

  checkWin();
}

/***********************
  SPAWN ECHO
************************/
setInterval(() => {
  if (!started || gameOver) return;
  if (moveHistory.length === 0) return;

  const echo = document.createElement("div");
  echo.className = "echo";
  echo.style.left = playerPos.x + "px";
  echo.style.top = playerPos.y + "px";

  game.appendChild(echo);

  echoes.push({
    el: echo,
    pos: { ...playerPos },
    moves: [...moveHistory]
  });
}, ECHO_SPAWN_TIME);

/***********************
  MOVE ECHOES
************************/
setInterval(() => {
  if (!started || gameOver) return;

  echoes.forEach(e => {
    const m = e.moves.shift();
    if (!m) return;

    e.pos.x += m.dx * STEP;
    e.pos.y += m.dy * STEP;

    e.el.style.left = e.pos.x + "px";
    e.el.style.top = e.pos.y + "px";

    if (
      e.pos.x === playerPos.x &&
      e.pos.y === playerPos.y
    ) {
      endGame();
    }
  });
}, ECHO_MOVE_TIME);

/***********************
  WIN CHECK
************************/
function checkWin() {
  const p = player.getBoundingClientRect();
  const g = goal.getBoundingClientRect();

  if (
    p.left < g.right &&
    p.right > g.left &&
    p.top < g.bottom &&
    p.bottom > g.top
  ) {
    level++;
    score += 100;
    hud.innerText = `Level: ${level} | Score: ${score}`;
    resetLevel();
  }
}

/***********************
  RESET LEVEL
************************/
function resetLevel() {
  echoes.forEach(e => e.el.remove());
  echoes = [];
  moveHistory = [];
  playerPos = { x: 40, y: 40 };
  player.style.left = "40px";
  player.style.top = "40px";
}

/***********************
  GAME OVER
************************/
function endGame() {
  gameOver = true;
  alert(`Game Over\nLevel: ${level}\nScore: ${score}`);
  location.reload();
}

/***********************
  INPUT
************************/
document.addEventListener("keydown", e => {
  if (!started) {
    startGame();
    return;
  }

  if (e.key === "ArrowUp") move(0, -1);
  if (e.key === "ArrowDown") move(0, 1);
  if (e.key === "ArrowLeft") move(-1, 0);
  if (e.key === "ArrowRight") move(1, 0);
});

/***********************
  INITIAL POSITION
************************/
player.style.left = playerPos.x + "px";
player.style.top = playerPos.y + "px";
