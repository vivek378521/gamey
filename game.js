// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const lordRamaImage = new Image();
lordRamaImage.src = "lord-ram.jpg";
// Player properties
const player = {
  x: canvas.width / 2 - 100,
  y: canvas.height - 150,
  width: 50,
  height: 80,
  image: lordRamaImage, // Use the Lord Rama image
  speed: 5
};

const bulletWidth = 5;
const bulletHeight = 30;
const bullets = [];

// Bullet properties
function createBullet() {
  return {
    x: 0,
    y: 0,
    width: bulletWidth,
    height: bulletHeight,
    color: "#F00",
    speed: 5,
    active: false
  };
}

const ravanaImage = new Image();
ravanaImage.src = "raavan.jpeg";

// Enemy properties
const enemies = [];
const enemyWidth = 50;
const enemyHeight = 60;
const enemyRowCount = 5;
const enemyColCount = 8;

const initialEnemyY = player.y - (canvas.height / 3) - (enemyRowCount * (enemyHeight + 10)); // Start enemies 1/3rd above the player

for (let col = 0; col < enemyColCount; col++) {
  for (let row = 0; row < enemyRowCount; row++) {
    const enemy = {
      x: col * (enemyWidth + 10) + Math.random() * (canvas.width - enemyColCount * (enemyWidth + 10)),
      y: row * (enemyHeight + 10) + initialEnemyY,
      width: enemyWidth,
      height: enemyHeight,
      image: ravanaImage, // Use the Ravana image
      alive: true
    };
    enemies.push(enemy);
  }
}




window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);


function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    player.moveRight = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    player.moveLeft = true;
  } else if (e.code === "Space") {
    fireBullet();
  }
}


function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    player.moveRight = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    player.moveLeft = false;
  }
}

function movePlayer() {
  if (player.moveRight && player.x < canvas.width - player.width) {
    player.x += player.speed;
  } else if (player.moveLeft && player.x > 0) {
    player.x -= player.speed;
  }
}

function moveBullets() {
  for (const bullet of bullets) {
    if (bullet.active) {
      bullet.y -= bullet.speed;

      // Check for collision with enemies
      checkBulletCollision(bullet);

      // Check if bullet is out of bounds
      if (bullet.y < 0) {
        bullet.active = false;
      }
    }
  }

  // Remove inactive bullets
  bullets.filter(bullet => bullet.active);
}

function fireBullet() {
  const newBullet = createBullet();
  newBullet.x = player.x + player.width / 2 - bulletWidth / 2;
  newBullet.y = player.y;
  newBullet.active = true;
  bullets.push(newBullet);
}


function moveEnemies() {
  for (const enemy of enemies) {
    if (enemy.alive) {
      // Move enemies down slowly
      enemy.y += 0.1;

      // Check for collision with player
      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        // Game over if player collides with enemy
        alert("Game Over!");
        document.location.reload();
      }

      for (const bullet of bullets) {
        // Check for collision with bullet
        if (
          bullet.active &&
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          enemy.alive = false;
          bullet.active = false;
        }
      }
    }
  }
}

function checkBulletCollision() {
  for (const enemy of enemies) {
    for (const bullet of bullets) {
      if (
        enemy.alive &&
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemy.alive = false;
        bullet.active = false;
      }
    }
  }
}

function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}


function drawBullets() {
  for (const bullet of bullets) {
    if (bullet.active) {
      ctx.fillStyle = "#FFA500"; // Orange color
      ctx.beginPath();
      ctx.moveTo(bullet.x, bullet.y);
      ctx.lineTo(bullet.x + bullet.width / 2, bullet.y - bullet.height);
      ctx.lineTo(bullet.x + bullet.width, bullet.y);
      ctx.fill();
    }
  }
}



function drawEnemies() {
  for (const enemy of enemies) {
    if (enemy.alive) {
      ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  moveBullets();
  moveEnemies();

  drawPlayer();
  drawBullets();
  drawEnemies();
  const allEnemiesDefeated = enemies.every(enemy => !enemy.alive);
  if (allEnemiesDefeated) {
    // Display "Jai Shri Ram" message
    ctx.fillStyle = "orange";
    ctx.font = "30px Arial";
    ctx.fillText("Jai Shri Ram", canvas.width / 2 - 100, canvas.height / 2);
    const textX = canvas.width / 2 - 100;
    const textY = canvas.height / 2;
    // Display an image below "Jai Shri Ram"
    const imageBelowText = new Image();
    imageBelowText.src = "ram.jpeg"; // Replace with the actual path
    imageBelowText.onload = () => {
      const textHeight = 30; // Height of the text
      const padding = 20; // Padding between text and image

      // Scale the image proportionally to fit within the canvas
      const scaleFactor = 0.2; // Adjust the scale factor as needed
      const scaledWidth = imageBelowText.width * scaleFactor;
      const scaledHeight = imageBelowText.height * scaleFactor;

      const imageX = canvas.width / 2 - scaledWidth / 2;
      const imageY = textY + textHeight + padding;

      ctx.drawImage(imageBelowText, imageX, imageY, scaledWidth, scaledHeight);
    };


  } else {
    // Continue the game loop
    setTimeout(() => requestAnimationFrame(draw), 1000 / 60); // Adjust the frame rate if needed
  }

}

// Start the game loop
draw();
