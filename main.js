const gameArea = document.getElementById('game');
const player = document.getElementById('player');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const newGameButton = document.getElementById('newGameButton');
const scoreDisplay = document.getElementById('scoreDisplay'); // Add this line

let playerX = gameArea.clientWidth / 2 - player.clientWidth / 2;
let playerY = gameArea.clientHeight / 2 - player.clientHeight / 2;
const playerSpeed = 100;
const bulletSpeed = 100;
const enemySpeed = 2;
let bullets = [];
let enemies = [];
let score = 0;
let gamePaused = false;
let enemyCreationInterval;
let gameLoopId;
let isDragging = false;
let startX, startY, initialPlayerX, initialPlayerY;

document.addEventListener('keydown', (e) => {
    if (!gamePaused) {
        if (e.key === ' ') {
            shootBullet();
        }
    }
});

document.addEventListener('mousedown', (e) => {
    if (!gamePaused) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialPlayerX = playerX;
        initialPlayerY = playerY;
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging && !gamePaused) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        playerX = initialPlayerX + deltaX;
        playerY = initialPlayerY + deltaY;
        playerX = Math.max(0, Math.min(gameArea.clientWidth - player.clientWidth, playerX));
        playerY = Math.max(0, Math.min(gameArea.clientHeight - player.clientHeight, playerY));
        player.style.left = playerX + 'px';
        player.style.top = playerY + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('touchstart', (e) => {
    if (!gamePaused) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialPlayerX = playerX;
        initialPlayerY = playerY;
    }
});

document.addEventListener('touchmove', (e) => {
    if (isDragging && !gamePaused) {
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        playerX = initialPlayerX + deltaX;
        playerY = initialPlayerY + deltaY;
        playerX = Math.max(0, Math.min(gameArea.clientWidth - player.clientWidth, playerX));
        playerY = Math.max(0, Math.min(gameArea.clientHeight - player.clientHeight, playerY));
        player.style.left = playerX + 'px';
        player.style.top = playerY + 'px';
    }
});

document.addEventListener('touchend', () => {
    isDragging = false;
});

pauseButton.addEventListener('click', () => {
    gamePaused = !gamePaused;
    if (gamePaused) {
        cancelAnimationFrame(gameLoopId);
        clearInterval(enemyCreationInterval);
        pauseButton.textContent = 'Resume';
    } else {
        gameLoop();
        enemyCreationInterval = setInterval(createEnemy, 1000);
        pauseButton.textContent = 'Pause';
    }
});

restartButton.addEventListener('click', () => {
    resetGame();
    gameLoop();
});

newGameButton.addEventListener('click', () => {
    resetGame();
    gameLoop();
});

function shootBullet() {
    const bulletLeft = document.createElement('div');
    bulletLeft.classList.add('bullet');
    bulletLeft.style.left = (playerX - 10) + 'px'; // Bullet starting position left
    bulletLeft.style.top = (playerY + player.clientHeight / 2) + 'px'; // Center vertical position
    bulletLeft.dataset.direction = 'up'; // Custom data attribute to track direction
    gameArea.appendChild(bulletLeft);
    bullets.push(bulletLeft);

    const bulletRight = document.createElement('div');
    bulletRight.classList.add('bullet');
    bulletRight.style.left = (playerX + player.clientWidth) + 'px'; // Bullet starting position right
    bulletRight.style.top = (playerY + player.clientHeight / 2) + 'px'; // Center vertical position
    bulletRight.dataset.direction = 'up'; // Custom data attribute to track direction
    gameArea.appendChild(bulletRight);
    bullets.push(bulletRight);
}

function createEnemy() {
    if (!gamePaused) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = Math.random() * (gameArea.clientWidth - 40) + 'px';
        enemy.style.top = '0px';
        gameArea.appendChild(enemy);
        enemies.push(enemy);
    }
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        const direction = bullet.dataset.direction;
        if (direction === 'up') {
            bullet.style.top = parseInt(bullet.style.top) - bulletSpeed + 'px';
        }

        // Remove bullets that go out of bounds
        if (parseInt(bullet.style.top) < 0) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.style.top = parseInt(enemy.style.top) + enemySpeed + 'px';
        if (parseInt(enemy.style.top) > gameArea.clientHeight) {
            enemy.remove();
            enemies.splice(index, 1);
        }
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            const bulletRect = bullet.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();
            if (
                bulletRect.left < enemyRect.left + enemyRect.width &&
                bulletRect.left + bulletRect.width > enemyRect.left &&
                bulletRect.top < enemyRect.top + enemyRect.height &&
                bulletRect.top + bulletRect.height > enemyRect.top
            ) {
                bullet.remove();
                enemy.remove();
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score++;
                updateScore(); // Update score display
            }
        });
    });
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`; // Update score display element
}

function gameLoop() {
    if (!gamePaused) {
        moveBullets();
        moveEnemies();
        checkCollisions();
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

function resetGame() {
    gamePaused = false;
    pauseButton.textContent = 'Pause';
    bullets.forEach(bullet => bullet.remove());
    enemies.forEach(enemy => enemy.remove());
    bullets = [];
    enemies = [];
    score = 0;
    updateScore(); // Initialize score display
    playerX = gameArea.clientWidth / 2 - player.clientWidth / 2;
    playerY = gameArea.clientHeight / 2 - player.clientHeight / 2;
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
    clearInterval(enemyCreationInterval);
    enemyCreationInterval = setInterval(createEnemy, 1000);
}

enemyCreationInterval = setInterval(createEnemy, 1000);
gameLoop();
