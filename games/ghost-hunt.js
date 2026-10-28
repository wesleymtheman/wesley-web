// Ghost Hunt — spooky arcade
// WesleyDude.com

class GhostHunt {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'waiting';

        this.player = { x: 240, y: 240, r: 16, speed: 3.2 };
        this.keys = {};
        this.ghosts = [];
        this.candies = [];
        this.particles = [];
        this.fog = [];

        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.candyGoal = 5;
        this.candyCollected = 0;
        this.invincibleUntil = 0;
        this.highScore = Number(localStorage.getItem('ghostHuntHighScore') || 0);
        this.lastTime = 0;
        this.raf = null;

        this.init();
    }

    init() {
        this.makeFog();
        this.bindEvents();
        this.updateDisplay();
        this.showMessage('Enter the haunted night... 👻', 'info');
        this.draw(0);
    }

    makeFog() {
        this.fog = [];
        for (let i = 0; i < 40; i++) {
            this.fog.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                r: 20 + Math.random() * 50,
                a: 0.03 + Math.random() * 0.06,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.2
            });
        }
    }

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        document.getElementById('instructionsBtn').addEventListener('click', () => this.showInstructions());
        document.getElementById('closeInstructions').addEventListener('click', () => this.hideInstructions());
        document.getElementById('instructionsModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hideInstructions();
        });

        window.addEventListener('keydown', (e) => {
            const k = e.key.toLowerCase();
            if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k) ||
                ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            this.keys[k] = true;
            this.keys[e.key] = true;

            if (e.key === ' ') {
                if (this.gameState === 'waiting' || this.gameState === 'gameOver') this.startGame();
                else if (this.gameState === 'playing') this.togglePause();
                else if (this.gameState === 'paused') this.togglePause();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.key] = false;
        });
    }

    startGame() {
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.candyGoal = 5;
        this.candyCollected = 0;
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;
        this.ghosts = [];
        this.candies = [];
        this.particles = [];
        this.invincibleUntil = 0;
        this.spawnWave();
        this.gameState = 'playing';
        this.hideOverlay();
        this.updateDisplay();
        this.showMessage(`Wave ${this.wave} — collect ${this.candyGoal} candy!`, 'info');
        this.lastTime = performance.now();
        cancelAnimationFrame(this.raf);
        this.loop(this.lastTime);
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.showOverlay('Paused', 'Press SPACE to continue');
            this.showMessage('Paused', 'info');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.hideOverlay();
            this.lastTime = performance.now();
            this.loop(this.lastTime);
        }
    }

    spawnWave() {
        const ghostCount = 1 + this.wave;
        this.ghosts = [];
        for (let i = 0; i < ghostCount; i++) {
            this.ghosts.push(this.makeGhost());
        }
        this.candies = [];
        for (let i = 0; i < this.candyGoal; i++) {
            this.candies.push(this.makeCandy());
        }
        this.candyCollected = 0;
    }

    makeGhost() {
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        if (edge === 0) { x = Math.random() * this.canvas.width; y = -20; }
        else if (edge === 1) { x = this.canvas.width + 20; y = Math.random() * this.canvas.height; }
        else if (edge === 2) { x = Math.random() * this.canvas.width; y = this.canvas.height + 20; }
        else { x = -20; y = Math.random() * this.canvas.height; }
        return {
            x, y,
            r: 14 + Math.random() * 6,
            speed: 1.1 + this.wave * 0.18 + Math.random() * 0.4,
            wobble: Math.random() * Math.PI * 2,
            hue: 180 + Math.random() * 80
        };
    }

    makeCandy() {
        const margin = 30;
        return {
            x: margin + Math.random() * (this.canvas.width - margin * 2),
            y: margin + Math.random() * (this.canvas.height - margin * 2),
            r: 10,
            bob: Math.random() * Math.PI * 2
        };
    }

    loop(now) {
        if (this.gameState !== 'playing') return;
        const dt = Math.min(32, now - this.lastTime) / 16.67;
        this.lastTime = now;
        this.update(dt, now);
        this.draw(now);
        this.raf = requestAnimationFrame((t) => this.loop(t));
    }

    update(dt, now) {
        let mx = 0;
        let my = 0;
        if (this.keys.w || this.keys.arrowup) my -= 1;
        if (this.keys.s || this.keys.arrowdown) my += 1;
        if (this.keys.a || this.keys.arrowleft) mx -= 1;
        if (this.keys.d || this.keys.arrowright) mx += 1;
        if (mx || my) {
            const len = Math.hypot(mx, my);
            this.player.x += (mx / len) * this.player.speed * dt;
            this.player.y += (my / len) * this.player.speed * dt;
        }
        this.player.x = Math.max(this.player.r, Math.min(this.canvas.width - this.player.r, this.player.x));
        this.player.y = Math.max(this.player.r, Math.min(this.canvas.height - this.player.r, this.player.y));

        this.fog.forEach((f) => {
            f.x += f.vx * dt;
            f.y += f.vy * dt;
            if (f.x < -60) f.x = this.canvas.width + 60;
            if (f.x > this.canvas.width + 60) f.x = -60;
            if (f.y < -60) f.y = this.canvas.height + 60;
            if (f.y > this.canvas.height + 60) f.y = -60;
        });

        this.candies.forEach((c) => { c.bob += 0.08 * dt; });
        this.candies = this.candies.filter((c) => {
            if (Math.hypot(c.x - this.player.x, c.y - this.player.y) < this.player.r + c.r) {
                this.score += 10;
                this.candyCollected += 1;
                this.burst(c.x, c.y, '#ff9f43');
                this.updateDisplay();
                return false;
            }
            return true;
        });

        this.ghosts.forEach((g) => {
            g.wobble += 0.08 * dt;
            const dx = this.player.x - g.x;
            const dy = this.player.y - g.y;
            const dist = Math.hypot(dx, dy) || 1;
            g.x += (dx / dist) * g.speed * dt + Math.cos(g.wobble) * 0.4;
            g.y += (dy / dist) * g.speed * dt + Math.sin(g.wobble) * 0.4;

            if (now > this.invincibleUntil &&
                Math.hypot(g.x - this.player.x, g.y - this.player.y) < this.player.r + g.r - 2) {
                this.hit(now);
            }
        });

        this.particles = this.particles.filter((p) => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            return p.life > 0;
        });

        if (this.candyCollected >= this.candyGoal) {
            this.score += 50;
            this.wave += 1;
            this.candyGoal = 5 + Math.floor(this.wave / 2);
            this.spawnWave();
            this.updateDisplay();
            this.showMessage(`Wave ${this.wave}! More ghosts incoming...`, 'success');
        }
    }

    hit(now) {
        this.lives -= 1;
        this.invincibleUntil = now + 1500;
        this.burst(this.player.x, this.player.y, '#ff4757');
        this.updateDisplay();
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.showMessage(`Ouch! ${this.lives} lives left`, 'error');
            this.player.x = this.canvas.width / 2;
            this.player.y = this.canvas.height / 2;
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        cancelAnimationFrame(this.raf);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('ghostHuntHighScore', String(this.highScore));
        }
        this.updateDisplay();
        this.showOverlay('Game Over 👻', `Score: ${this.score} — Press SPACE to try again`);
        this.showMessage('The ghosts got you!', 'error');
    }

    burst(x, y, color) {
        for (let i = 0; i < 10; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = 1 + Math.random() * 2.5;
            this.particles.push({
                x, y,
                vx: Math.cos(a) * s,
                vy: Math.sin(a) * s,
                life: 20 + Math.random() * 15,
                color
            });
        }
    }

    draw(now) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = '#0d0818';
        ctx.fillRect(0, 0, w, h);

        // subtle grid
        ctx.strokeStyle = 'rgba(120, 60, 180, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, h);
            ctx.stroke();
        }
        for (let j = 0; j < h; j += 40) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(w, j);
            ctx.stroke();
        }

        this.fog.forEach((f) => {
            ctx.beginPath();
            ctx.fillStyle = `rgba(140, 80, 200, ${f.a})`;
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
        });

        this.candies.forEach((c) => {
            const y = c.y + Math.sin(c.bob) * 4;
            ctx.font = '20px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🍬', c.x, y);
        });

        this.ghosts.forEach((g) => {
            ctx.save();
            ctx.translate(g.x, g.y + Math.sin(g.wobble) * 3);
            ctx.font = `${g.r * 2.2}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = `hsla(${g.hue}, 80%, 70%, 0.7)`;
            ctx.shadowBlur = 16;
            ctx.fillText('👻', 0, 0);
            ctx.restore();
        });

        this.particles.forEach((p) => {
            ctx.globalAlpha = Math.max(0, p.life / 30);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        // player pumpkin
        const flash = now < this.invincibleUntil && Math.floor(now / 100) % 2 === 0;
        if (!flash) {
            ctx.font = '32px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(255, 140, 0, 0.8)';
            ctx.shadowBlur = 18;
            ctx.fillText('🎃', this.player.x, this.player.y);
            ctx.shadowBlur = 0;
        }

        // vignette
        const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.75);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('wave').textContent = this.wave;
    }

    showOverlay(title, message) {
        const overlay = document.getElementById('gameOverlay');
        document.getElementById('overlayTitle').textContent = title;
        document.getElementById('overlayMessage').textContent = message;
        overlay.classList.remove('hidden');
    }

    hideOverlay() {
        document.getElementById('gameOverlay').classList.add('hidden');
    }

    showInstructions() {
        document.getElementById('instructionsModal').classList.add('show');
    }

    hideInstructions() {
        document.getElementById('instructionsModal').classList.remove('show');
    }

    showMessage(text, type = 'info') {
        const container = document.getElementById('gameMessages');
        const el = document.createElement('div');
        el.className = `message ${type}`;
        el.textContent = text;
        container.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 300);
        }, 2200);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GhostHunt();
});
