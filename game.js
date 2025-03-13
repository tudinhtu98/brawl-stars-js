// Game variables
const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const joystick = document.querySelector('.joystick');
const joystickKnob = document.querySelector('.joystick-knob');
const actionButton = document.querySelector('.action-button');
const startMenu = document.getElementById('start-menu');
const gameOverMenu = document.getElementById('game-over-menu');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const fullscreenToggleStart = document.getElementById('fullscreen-toggle');
const fullscreenToggleEnd = document.getElementById('fullscreen-toggle-end');
const finalScore = document.getElementById('final-score');

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;
let playerSpeed = 5;
let playerHealth = 100;
let playerScore = 0;
let projectiles = [];
let enemies = [];
let bushes = [];
let boxes = [];
let joystickActive = false;
let joystickAngle = 0;
let joystickDistance = 0;
let joystickCenterX = 0;
let joystickCenterY = 0;
let gameRunning = false;

// Initialize game
function initGame() {
    gameRunning = true;
    updatePlayerPosition();

    // Create some bushes
    for (let i = 0; i < 10; i++) {
        createBush();
    }

    // Create some boxes
    for (let i = 0; i < 8; i++) {
        createBox();
    }

    // Add enemies every few seconds
    setInterval(createEnemy, 3000);

    // Start game loop
    gameLoop();
}

// Game loop
function gameLoop() {
    if (gameRunning) {
        movePlayer();
        moveProjectiles();
        moveEnemies();
        checkCollisions();
        requestAnimationFrame(gameLoop);
    }
}

// Update player position
function updatePlayerPosition() {
    player.style.left = (playerX - 30) + 'px';
    player.style.top = (playerY - 40) + 'px';
}

// Move player based on joystick
function movePlayer() {
    if (joystickActive && joystickDistance > 10) {
        const moveX = Math.cos(joystickAngle) * playerSpeed * (joystickDistance / 30);
        const moveY = Math.sin(joystickAngle) * playerSpeed * (joystickDistance / 30);

        playerX += moveX;
        playerY += moveY;

        playerX = Math.max(50, Math.min(window.innerWidth - 50, playerX));
        playerY = Math.max(50, Math.min(window.innerHeight - 50, playerY));

        updatePlayerPosition();

        const rotationAngle = (joystickAngle * 180 / Math.PI) + 90;
        player.style.transform = `perspective(600px) rotateX(30deg) rotateZ(${rotationAngle}deg)`;
    }
}

// Create a projectile
function createProjectile() {
    if (!gameRunning) return;

    const projectile = document.createElement('div');
    projectile.className = 'projectile';

    const projectileX = playerX;
    const projectileY = playerY;

    const direction = joystickAngle;
    const speed = 10;

    gameContainer.appendChild(projectile);

    projectiles.push({
        element: projectile,
        x: projectileX,
        y: projectileY,
        direction: direction,
        speed: speed
    });
}

// Move projectiles
function moveProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];

        projectile.x += Math.cos(projectile.direction) * projectile.speed;
        projectile.y += Math.sin(projectile.direction) * projectile.speed;

        projectile.element.style.left = (projectile.x - 10) + 'px';
        projectile.element.style.top = (projectile.y - 10) + 'px';

        if (projectile.x < 0 || projectile.x > window.innerWidth ||
            projectile.y < 0 || projectile.y > window.innerHeight) {
            gameContainer.removeChild(projectile.element);
            projectiles.splice(i, 1);
        }
    }
}

// Create an enemy
function createEnemy() {
    if (!gameRunning) return;

    const enemy = document.createElement('div');
    enemy.className = 'enemy';

    const enemyBody = document.createElement('div');
    enemyBody.className = 'enemy-body';

    const enemyHead = document.createElement('div');
    enemyHead.className = 'enemy-head';

    const shadow = document.createElement('div');
    shadow.className = 'shadow';

    const healthBar = document.createElement('div');
    healthBar.className = 'health-bar';

    const healthFill = document.createElement('div');
    healthFill.className = 'health-fill';

    healthBar.appendChild(healthFill);
    enemy.appendChild(shadow);
    enemy.appendChild(enemyBody);
    enemy.appendChild(enemyHead);
    enemy.appendChild(healthBar);

    let enemyX, enemyY;
    if (Math.random() < 0.5) {
        enemyX = Math.random() < 0.5 ? 0 : window.innerWidth;
        enemyY = Math.random() * window.innerHeight;
    } else {
        enemyX = Math.random() * window.innerWidth;
        enemyY = Math.random() < 0.5 ? 0 : window.innerHeight;
    }

    gameContainer.appendChild(enemy);

    enemies.push({
        element: enemy,
        healthBar: healthFill,
        x: enemyX,
        y: enemyY,
        speed: 1 + Math.random() * 2,
        health: 100
    });
}

// Move enemies
function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        const dx = playerX - enemy.x;
        const dy = playerY - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 10) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;

            const angle = Math.atan2(dy, dx);
            const rotationAngle = (angle * 180 / Math.PI) + 90;
            enemy.element.style.transform = `perspective(600px) rotateX(30deg) rotateZ(${rotationAngle}deg)`;
        }

        enemy.element.style.left = (enemy.x - 30) + 'px';
        enemy.element.style.top = (enemy.y - 40) + 'px';
    }
}

// Create a bush
function createBush() {
    const bush = document.createElement('div');
    bush.className = 'bush';

    const bushX = Math.random() * (window.innerWidth - 200) + 100;
    const bushY = Math.random() * (window.innerHeight - 200) + 100;

    bush.style.left = (bushX - 60) + 'px';
    bush.style.top = (bushY - 40) + 'px';

    gameContainer.appendChild(bush);

    bushes.push({
        element: bush,
        x: bushX,
        y: bushY
    });
}

// Create a box
function createBox() {
    const box = document.createElement('div');
    box.className = 'box';

    const boxX = Math.random() * (window.innerWidth - 200) + 100;
    const boxY = Math.random() * (window.innerHeight - 200) + 100;

    box.style.left = (boxX - 30) + 'px';
    box.style.top = (boxY - 30) + 'px';

    gameContainer.appendChild(box);

    boxes.push({
        element: box,
        x: boxX,
        y: boxY,
        health: 100
    });
}

// Check collisions
function checkCollisions() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];

        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];

            const dx = projectile.x - enemy.x;
            const dy = projectile.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 40) {
                enemy.health -= 20;
                enemy.healthBar.style.width = enemy.health + '%';

                gameContainer.removeChild(projectile.element);
                projectiles.splice(i, 1);

                if (enemy.health <= 0) {
                    gameContainer.removeChild(enemy.element);
                    enemies.splice(j, 1);

                    playerScore += 10;
                    scoreDisplay.textContent = 'Score: ' + playerScore;
                }

                break;
            }
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        const dx = playerX - enemy.x;
        const dy = playerY - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 50) {
            playerHealth -= 0.2;
            player.querySelector('.health-fill').style.width = playerHealth + '%';

            if (playerHealth <= 0) {
                endGame();
            }
        }
    }
}

// End game
function endGame() {
    gameRunning = false;
    gameContainer.style.display = 'none';
    gameOverMenu.style.display = 'flex';
    finalScore.textContent = 'Score: ' + playerScore;
}

// Reset game
function resetGame() {
    playerX = window.innerWidth / 2;
    playerY = window.innerHeight / 2;
    playerHealth = 100;
    playerScore = 0;
    scoreDisplay.textContent = 'Score: 0';
    player.querySelector('.health-fill').style.width = '100%';

    for (const enemy of enemies) {
        gameContainer.removeChild(enemy.element);
    }
    enemies = [];

    for (const projectile of projectiles) {
        gameContainer.removeChild(projectile.element);
    }
    projectiles = [];

    for (const bush of bushes) {
        gameContainer.removeChild(bush.element);
    }
    bushes = [];

    for (const box of boxes) {
        gameContainer.removeChild(box.element);
    }
    boxes = [];

    updatePlayerPosition();
}

// Joystick controls
joystick.addEventListener('touchstart', handleJoystickStart);
joystick.addEventListener('touchmove', handleJoystickMove);
joystick.addEventListener('touchend', handleJoystickEnd);

joystick.addEventListener('mousedown', handleJoystickStart);
window.addEventListener('mousemove', handleJoystickMove);
window.addEventListener('mouseup', handleJoystickEnd);

function handleJoystickStart(e) {
    if (!gameRunning) return;
    joystickActive = true;
    joystickCenterX = joystick.getBoundingClientRect().left + 60;
    joystickCenterY = joystick.getBoundingClientRect().top + 60;
}

function handleJoystickMove(e) {
    if (!joystickActive) return;

    let clientX, clientY;
    if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const dx = clientX - joystickCenterX;
    const dy = clientY - joystickCenterY;
    joystickDistance = Math.min(50, Math.sqrt(dx * dx + dy * dy));
    joystickAngle = Math.atan2(dy, dx);

    const moveX = Math.cos(joystickAngle) * joystickDistance;
    const moveY = Math.sin(joystickAngle) * joystickDistance;

    joystickKnob.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

function handleJoystickEnd() {
    joystickActive = false;
    joystickKnob.style.transform = 'translate(0, 0)';
}

// Fire button
actionButton.addEventListener('touchstart', createProjectile);
actionButton.addEventListener('mousedown', createProjectile);

// Start and restart buttons
startButton.addEventListener('click', () => {
    startMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    resetGame();
    initGame();
});

restartButton.addEventListener('click', () => {
    gameOverMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    resetGame();
    initGame();
});

// Fullscreen toggle
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

fullscreenToggleStart.addEventListener('click', toggleFullscreen);
fullscreenToggleEnd.addEventListener('click', toggleFullscreen);

// Handle window resize
window.addEventListener('resize', function() {
    playerX = Math.min(playerX, window.innerWidth - 50);
    playerY = Math.min(playerY, window.innerHeight - 50);
    updatePlayerPosition();
});