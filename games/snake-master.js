// Snake Master Game
// WesleyDude.com

class SnakeMaster {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'waiting'; // waiting, playing, paused, gameOver
        
        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Snake
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.dx = 0;
        this.dy = 0;
        
        // Food
        this.food = { x: 15, y: 15 };
        
        // Game stats
        this.score = 0;
        this.highScore = localStorage.getItem('snakeMasterHighScore') || 0;
        this.gameSpeed = 150; // milliseconds
        this.gameTimer = null;
        
        // Input handling
        this.lastKey = '';
        this.keysPressed = new Set();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.showMessage('Welcome to Snake Master! 🐍', 'info');
        this.draw();
    }
    
    bindEvents() {
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Pause button
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pauseGame();
        });
        
        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Instructions button
        document.getElementById('instructionsBtn').addEventListener('click', () => {
            this.showInstructions();
        });
        
        // Close instructions
        document.getElementById('closeInstructions').addEventListener('click', () => {
            this.hideInstructions();
        });
        
        // Close instructions on modal background click
        document.getElementById('instructionsModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideInstructions();
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                this.handleKeyPress(e.key.toLowerCase());
            } else if (e.key === ' ') {
                e.preventDefault();
                if (this.gameState === 'waiting') {
                    this.startGame();
                } else if (this.gameState === 'paused') {
                    this.resumeGame();
                } else if (this.gameState === 'gameOver') {
                    this.resetGame();
                }
            }
        });
    }
    
    handleKeyPress(key) {
        // Prevent reverse direction
        if (key === 'w' && this.dy === 1) return;
        if (key === 's' && this.dy === -1) return;
        if (key === 'a' && this.dx === 1) return;
        if (key === 'd' && this.dx === -1) return;
        
        // Set direction
        switch(key) {
            case 'w':
                this.dx = 0;
                this.dy = -1;
                break;
            case 's':
                this.dx = 0;
                this.dy = 1;
                break;
            case 'a':
                this.dx = -1;
                this.dy = 0;
                break;
            case 'd':
                this.dx = 1;
                this.dy = 0;
                break;
        }
        
        // Debug log
        console.log(`Direction set: dx=${this.dx}, dy=${this.dy}`);
    }
    
    startGame() {
        if (this.gameState === 'waiting' || this.gameState === 'gameOver') {
            this.gameState = 'playing';
            this.resetSnake();
            this.generateFood();
            this.startGameLoop();
            this.hideOverlay();
            this.showMessage('Game Started! Use WASD to move! 🐍', 'info');
            
            document.getElementById('startBtn').textContent = 'Restart';
            document.getElementById('startBtn').onclick = () => this.resetGame();
        }
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            clearInterval(this.gameTimer);
            this.showOverlay('Game Paused', 'Press SPACE to resume');
            this.showMessage('Game Paused', 'info');
            
            document.getElementById('pauseBtn').textContent = 'Resume';
            document.getElementById('pauseBtn').onclick = () => this.resumeGame();
        }
    }
    
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startGameLoop();
            this.hideOverlay();
            this.showMessage('Game Resumed!', 'info');
            
            document.getElementById('pauseBtn').textContent = 'Pause';
            document.getElementById('pauseBtn').onclick = () => this.pauseGame();
        }
    }
    
    resetGame() {
        this.gameState = 'waiting';
        this.score = 0;
        this.resetSnake();
        this.generateFood();
        this.updateDisplay();
        this.showOverlay('Snake Master', 'Press SPACE to start!');
        this.draw();
        
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').onclick = () => this.startGame();
        
        document.getElementById('pauseBtn').textContent = 'Pause';
        document.getElementById('pauseBtn').onclick = () => this.pauseGame();
        
        this.showMessage('Game Reset! Ready to play? 🐍', 'info');
    }
    
    resetSnake() {
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.dx = 0;
        this.dy = 0;
    }
    
    startGameLoop() {
        this.gameTimer = setInterval(() => {
            this.update();
            this.draw();
        }, this.gameSpeed);
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Don't move if no direction is set
        if (this.dx === 0 && this.dy === 0) {
            console.log('Snake not moving - no direction set');
            return;
        }
        
        // Move snake head
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            console.log('Wall collision detected');
            this.gameOver();
            return;
        }
        
        // Check self collision (skip the head itself)
        for (let i = 1; i < this.snake.length; i++) {
            const segment = this.snake[i];
            if (head.x === segment.x && head.y === segment.y) {
                console.log('Self collision detected');
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood();
        } else {
            this.snake.pop();
        }
    }
    
    eatFood() {
        this.score += 10;
        this.generateFood();
        this.updateDisplay();
        this.showMessage(`Food eaten! +10 points! Score: ${this.score} 🍎`, 'success');
        
        // Increase speed every 5 foods
        if (this.score % 50 === 0 && this.gameSpeed > 80) {
            this.gameSpeed -= 10;
            clearInterval(this.gameTimer);
            this.startGameLoop();
            this.showMessage(`Speed increased! ⚡`, 'info');
        }
    }
    
    generateFood() {
        let newFood;
        let attempts = 0;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            attempts++;
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) && attempts < 100);
        
        this.food = newFood;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        clearInterval(this.gameTimer);
        
        // Check high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeMasterHighScore', this.highScore);
            this.showMessage(`New High Score: ${this.highScore}! 🏆`, 'success');
        } else {
            this.showMessage(`Game Over! Final Score: ${this.score} 💀`, 'error');
        }
        
        this.updateDisplay();
        this.showOverlay('Game Over!', `Score: ${this.score}<br>Press SPACE to play again`);
        
        document.getElementById('startBtn').textContent = 'Play Again';
        document.getElementById('startBtn').onclick = () => this.resetGame();
    }
    
    draw() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake with rainbow colors
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            
            // Create gradient for each segment
            const segmentGradient = this.ctx.createRadialGradient(
                segment.x * this.gridSize + this.gridSize/2,
                segment.y * this.gridSize + this.gridSize/2,
                0,
                segment.x * this.gridSize + this.gridSize/2,
                segment.y * this.gridSize + this.gridSize/2,
                this.gridSize/2
            );
            
            if (i === 0) {
                // Head - bright green with glow
                segmentGradient.addColorStop(0, '#66BB6A');
                segmentGradient.addColorStop(1, '#4CAF50');
                this.ctx.fillStyle = segmentGradient;
                
                // Add glow effect for head
                this.ctx.shadowColor = '#66BB6A';
                this.ctx.shadowBlur = 10;
            } else {
                // Body - rainbow colors based on position
                const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#4CAF50'];
                const colorIndex = i % colors.length;
                segmentGradient.addColorStop(0, colors[colorIndex]);
                segmentGradient.addColorStop(1, colors[colorIndex] + '80');
                this.ctx.fillStyle = segmentGradient;
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        }
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        
        // Draw food with pulsing effect
        const time = Date.now() * 0.005;
        const pulse = Math.sin(time) * 0.1 + 0.9;
        const foodSize = (this.gridSize - 4) * pulse;
        const offset = (this.gridSize - foodSize) / 2;
        
        // Food gradient
        const foodGradient = this.ctx.createRadialGradient(
            this.food.x * this.gridSize + this.gridSize/2,
            this.food.y * this.gridSize + this.gridSize/2,
            0,
            this.food.x * this.gridSize + this.gridSize/2,
            this.food.y * this.gridSize + this.gridSize/2,
            foodSize/2
        );
        foodGradient.addColorStop(0, '#ff6b6b');
        foodGradient.addColorStop(1, '#f44336');
        
        this.ctx.fillStyle = foodGradient;
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 15;
        
        this.ctx.fillRect(
            this.food.x * this.gridSize + offset,
            this.food.y * this.gridSize + offset,
            foodSize,
            foodSize
        );
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        
        // Draw subtle grid lines
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.3;
        
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    showOverlay(title, message) {
        const overlay = document.getElementById('gameOverlay');
        const titleEl = document.getElementById('overlayTitle');
        const messageEl = document.getElementById('overlayMessage');
        
        titleEl.textContent = title;
        messageEl.innerHTML = message;
        overlay.classList.remove('hidden');
    }
    
    hideOverlay() {
        const overlay = document.getElementById('gameOverlay');
        overlay.classList.add('hidden');
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
        document.getElementById('length').textContent = this.snake.length;
        document.getElementById('speed').textContent = Math.max(1, Math.floor((150 - this.gameSpeed) / 10) + 1);
    }
    
    showMessage(text, type = 'info') {
        const messagesContainer = document.getElementById('gameMessages');
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        messagesContainer.appendChild(message);
        
        // Show message
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        // Hide message
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 3000);
    }
    
    showInstructions() {
        document.getElementById('instructionsModal').classList.add('show');
    }
    
    hideInstructions() {
        document.getElementById('instructionsModal').classList.remove('show');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.snakeGame = new SnakeMaster();
    
    console.log('🐍 Snake Master loaded successfully!');
    console.log('💡 Use WASD keys to control your snake!');
    console.log('💡 Press SPACE to start/pause the game!');
});
