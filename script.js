const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const scoreboard = document.getElementById('scoreboard');
const restartBtn = document.getElementById('restartBtn');
const coin = document.getElementById('coin');
let coinScore = 0;
let jumpHeightBoost = 0;
let currentLevel = 1;




let isJumping = false;
let score = 0;
let highScore = localStorage.getItem('marioHighScore') || 0;
let gameOver = false;

function updateScore() {
  if (!gameOver) {
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('marioHighScore', highScore);
    }

    let newLevel = Math.floor(score / 100) + 1;

if (newLevel !== currentLevel) {
  currentLevel = newLevel;

  // Cycle difficulty: 1 = Easy, 2 = Medium, 0 = Hard
  let difficulty = currentLevel % 3;

  if (difficulty === 1) {
    document.documentElement.style.setProperty('--obstacle-speed', '3s'); // Easy
    document.body.style.backgroundColor = '#87ceeb';
  } else if (difficulty === 2) {
    document.documentElement.style.setProperty('--obstacle-speed', '2.2s'); // Medium
    document.body.style.backgroundColor = '#ffa07a';
  } else if (difficulty === 0) {
    document.documentElement.style.setProperty('--obstacle-speed', '1.5s'); // Hard
    document.body.style.backgroundColor = '#6a5acd';
  }

  pauseObstacle(1500); // brief delay on every level change
}

    
  }

  scoreboard.textContent = `Score: ${score} | Coins: ${coinScore} | Level: ${currentLevel} | High Score: ${highScore}`;

}




document.addEventListener('keydown', function (e) {
  if (e.code === 'Space' && !isJumping && !gameOver) {
    jump();
  }
});

function jump() {
  isJumping = true;
  let position = 0;

  // Scale the player up dynamically as it jumps
  let scaleUp = 1.2;
  player.style.transform = `scale(${scaleUp}) rotate(-10deg)`;

  // Speed up the jump
  let upInterval = setInterval(() => {
    if (position >= 250 + jumpHeightBoost) {

      clearInterval(upInterval);

      // Add a delay before falling to simulate weightlessness at the peak
      setTimeout(() => {
        let downInterval = setInterval(() => {
          if (position <= 0) {
            clearInterval(downInterval);
            isJumping = false;
            player.style.transform = 'scale(1) rotate(0deg)'; // Reset scale after landing
          } else {
            position -= 6; // Faster fall speed
            player.style.bottom = 80 + position + 'px';
          }
        }, 20); // Faster fall speed (but keeps the character in air for some time)
      }, 200); // Delay before falling starts
    } else {
      position += 12; // Increased upward speed
      player.style.bottom = 80 + position + 'px';
    }
  }, 15); // Increased interval for a quicker jump
}

// Collision detection
let checkCollision = setInterval(() => {
  const playerRect = player.getBoundingClientRect();
  const obsRect = obstacle.getBoundingClientRect();

  if (
    !gameOver &&
    playerRect.left < obsRect.right &&
    playerRect.right > obsRect.left &&
    playerRect.bottom > obsRect.top
  ) {
    endGame();
  }
}, 10);

setInterval(() => {
  const playerRect = player.getBoundingClientRect();
  const coinRect = coin.getBoundingClientRect();

  if (
    !gameOver &&
    playerRect.left < coinRect.right &&
    playerRect.right > coinRect.left &&
    playerRect.bottom > coinRect.top &&
    playerRect.top < coinRect.bottom
  ) {
    coinScore++;

    // Restart animation
    coin.style.animation = 'none';
    coin.offsetHeight; // force reflow
    coin.style.animation = '';
    coin.classList.add('coin'); // reapply class if needed
    
  }
}, 10);


function endGame() {
  gameOver = true;
  player.style.display = 'none';
  obstacle.style.animation = 'none';
  restartBtn.style.display = 'block';
  clearInterval(scoreInterval);
}

// Score increment
let scoreInterval = setInterval(updateScore, 100);

restartBtn.addEventListener('click', () => {
  location.reload();
});

// Initialize high score
scoreboard.textContent = `Score: 0 | High Score: ${highScore}`;
const coins = [document.getElementById('coin1'), document.getElementById('coin2'), document.getElementById('coin3')];

setInterval(() => {
  const playerRect = player.getBoundingClientRect();
  coins.forEach((coin) => {
    const coinRect = coin.getBoundingClientRect();
    if (
      !gameOver &&
      playerRect.left < coinRect.right &&
      playerRect.right > coinRect.left &&
      playerRect.bottom > coinRect.top &&
      playerRect.top < coinRect.bottom
    ) {
      coinScore++;
      if (coinScore === 10) {
        jumpHeightBoost = 50; // give power-up
        setTimeout(() => {
          jumpHeightBoost = 0; // reset after 5 seconds
        }, 5000);
      }
      
      coin.style.animation = 'none';
      coin.offsetHeight;
      coin.style.animation = '';
      coin.classList.add('coin');
      if (coinSound) coinSound.play();
    }
  });
}, 10);

function pauseObstacle(duration) {
  obstacle.style.animationPlayState = 'paused';
  setTimeout(() => {
    obstacle.style.animationPlayState = 'running';
  }, duration);
}
