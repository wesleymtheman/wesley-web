// Mole Mash
// WesleyDude.com

class MoleMash {
    constructor() {
        this.grid = document.getElementById('moleGrid');
        this.holes = [];
        this.score = 0;
        this.timeLeft = 30;
        this.playing = false;
        this.spawnTimer = null;
        this.tickTimer = null;
        this.active = null;
        this.high = Number(localStorage.getItem('moleMashHigh') || 0);
        this.build();
        this.bind();
        this.update();
    }

    build() {
        this.grid.innerHTML = '';
        this.holes = [];
        for (let i = 0; i < 9; i++) {
            const btn = document.createElement('button');
            btn.className = 'hole';
            btn.type = 'button';
            btn.innerHTML = '<span class="mole">🐹</span>';
            btn.addEventListener('click', () => this.whack(i));
            this.grid.appendChild(btn);
            this.holes.push(btn);
        }
    }

    bind() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    start() {
        clearInterval(this.spawnTimer);
        clearInterval(this.tickTimer);
        this.score = 0;
        this.timeLeft = 30;
        this.playing = true;
        this.hideMole();
        this.update();
        document.getElementById('gameMessages').innerHTML = '';
        document.getElementById('startBtn').textContent = 'Playing...';
        document.getElementById('startBtn').disabled = true;

        this.spawnTimer = setInterval(() => this.spawn(), 700);
        this.tickTimer = setInterval(() => {
            this.timeLeft -= 1;
            this.update();
            if (this.timeLeft <= 0) this.end();
        }, 1000);
        this.spawn();
    }

    spawn() {
        if (!this.playing) return;
        this.hideMole();
        const i = Math.floor(Math.random() * this.holes.length);
        this.active = i;
        this.holes[i].classList.add('up');
        setTimeout(() => {
            if (this.active === i) this.hideMole();
        }, 650 + Math.random() * 250);
    }

    hideMole() {
        this.holes.forEach((h) => h.classList.remove('up', 'bonk'));
        this.active = null;
    }

    whack(i) {
        if (!this.playing || this.active !== i) return;
        this.score += 1;
        this.holes[i].classList.add('bonk');
        this.holes[i].classList.remove('up');
        this.active = null;
        this.update();
    }

    end() {
        this.playing = false;
        clearInterval(this.spawnTimer);
        clearInterval(this.tickTimer);
        this.hideMole();
        if (this.score > this.high) {
            this.high = this.score;
            localStorage.setItem('moleMashHigh', String(this.high));
        }
        this.update();
        document.getElementById('startBtn').textContent = 'Play Again';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('gameMessages').innerHTML =
            `<div class="message success">Time's up! Score: ${this.score} 🎉</div>`;
    }

    update() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('time').textContent = this.timeLeft;
        document.getElementById('high').textContent = this.high;
    }
}

document.addEventListener('DOMContentLoaded', () => new MoleMash());
