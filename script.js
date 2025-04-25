const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = 'green';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

function updatePipes() {
  if (frame % 100 === 0) {
    let top = Math.random() * (canvas.height / 2);
    let gap = 120;
    pipes.push({
      x: canvas.width,
      width: 50,
      top: top,
      bottom: top + gap
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
      gameOver = true;
    }
  }

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 25);
}

function updateScore() {
  pipes.forEach(pipe => {
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.passed = true;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
}

function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  updatePipes();
  updateScore();
  checkCollision();
}

function loop() {
  if (!gameOver) {
    update();
    draw();
    frame++;
    requestAnimationFrame(loop);
  } else {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
  }
}

function flap() {
  bird.velocity = bird.lift;
}

document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') flap();
});

canvas.addEventListener('touchstart', flap);
canvas.addEventListener('click', flap);

loop();
