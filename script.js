// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 8;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 5,
    speed: 5,
    radius: ballSize
};

const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

let playerScore = 0;
let computerScore = 0;

// Keyboard input
const keys = {
    ArrowUp: false,
    ArrowDown: false
};

// Mouse position
let mouseY = canvas.height / 2;

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = true;
    if (e.key === 'ArrowDown') keys.ArrowDown = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.ArrowUp = false;
    if (e.key === 'ArrowDown') keys.ArrowDown = false;
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

document.getElementById('resetBtn').addEventListener('click', resetGame);

// Update player paddle position
function updatePlayerPaddle() {
    if (keys.ArrowUp) {
        player.y = Math.max(0, player.y - player.speed);
    }
    if (keys.ArrowDown) {
        player.y = Math.min(canvas.height - player.height, player.y + player.speed);
    }
    
    // Mouse control
    const targetY = mouseY - player.height / 2;
    player.y = Math.max(0, Math.min(canvas.height - player.height, targetY));
}

// Update computer paddle (AI)
function updateComputerPaddle() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    if (computerCenter < ballCenter - 35) {
        computer.y = Math.min(canvas.height - computer.height, computer.y + computer.speed);
    } else if (computerCenter > ballCenter + 35) {
        computer.y = Math.max(0, computer.y - computer.speed);
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }
    
    // Ball collision with paddles
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.radius;
        
        // Add spin based on paddle position
        const deltaY = ball.y - (player.y + player.height / 2);
        ball.dy += deltaY * 0.05;
    }
    
    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.radius;
        
        // Add spin based on paddle position
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy += deltaY * 0.05;
    }
    
    // Ball out of bounds
    if (ball.x - ball.radius < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }
    
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
}

// Reset ball position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 6;
}

// Draw functions
function drawPaddle(x, y, width, height) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(x, y, width, height);
    ctx.shadowColor = 'rgba(0, 255, 0, 0.8)';
    ctx.shadowBlur = 10;
}

function drawBall() {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 10;
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    drawCenterLine();
    
    // Draw paddles and ball
    drawPaddle(player.x, player.y, player.width, player.height);
    drawPaddle(computer.x, computer.y, computer.width, computer.height);
    drawBall();
    
    ctx.shadowColor = 'transparent';
}

// Game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Reset game
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
    resetBall();
    player.y = canvas.height / 2 - paddleHeight / 2;
    computer.y = canvas.height / 2 - paddleHeight / 2;
}

// Start the game
gameLoop();
