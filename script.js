const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart-btn');
const scoreboard = document.getElementById('scoreboard');

let bird, pipes, frame, score, gameOver;

function resetGame() {
  bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    gravity: 0.6,
    lift: -10,
    velocity: 0
  };
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  restartBtn.style.display = 'none';
  scoreboard.textContent = "Score: 0";
  loop();
}

function drawBird() {
  ctx.fillStyle = '#ffeb3b';
  ctx.beginPath();
  ctx.arc(bird.x + bird.width / 2, bird.y + bird.height / 2, bird.width / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = '#4caf50';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

function updatePipes() {
  if (frame % 100 === 0) {
    let top = Math.random() * (canvas.height / 2);
    let gap = 140;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      bottom: top + gap,
      passed: false
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function checkCollision() {
  for (let pipe of pipes) {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      return true;
    }
  }

  return bird.y + bird.height > canvas.height || bird.y < 0;
}

function updateScore() {
  pipes.forEach(pipe => {
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.passed = true;
      scoreboard.textContent = "Score: " + score;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
}

function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  updatePipes();
  updateScore();

  if (checkCollision()) {
    gameOver = true;
    restartBtn.style.display = 'block';
  }
}

function loop() {
  if (!gameOver) {
    update();
    draw();
    frame++;
    requestAnimationFrame(loop);
  } else {
    ctx.fillStyle = 'red';
    ctx.font = '36px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
  }
}

function flap() {
  bird.velocity = bird.lift;
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') flap();
});

canvas.addEventListener('click', flap);
canvas.addEventListener('touchstart', flap);
restartBtn.addEventListener('click', resetGame);

resetGame();
