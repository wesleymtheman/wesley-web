// Memory Match
// WesleyDude.com

const EMOJIS = ['🚀', '🎮', '🍕', '🐱', '🌈', '⚡', '🎧', '🍩'];

class MemoryMatch {
    constructor() {
        this.board = document.getElementById('memoryBoard');
        this.moves = 0;
        this.matches = 0;
        this.flipped = [];
        this.lock = false;
        this.best = localStorage.getItem('memoryMatchBest');
        this.bind();
        this.newGame();
    }

    bind() {
        document.getElementById('restartBtn').addEventListener('click', () => this.newGame());
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    newGame() {
        this.moves = 0;
        this.matches = 0;
        this.flipped = [];
        this.lock = false;
        this.updateStats();
        document.getElementById('gameMessages').innerHTML = '';

        const deck = [...EMOJIS, ...EMOJIS]
            .map((emoji, i) => ({ id: i, emoji, key: emoji }))
            .sort(() => Math.random() - 0.5);

        this.board.innerHTML = '';
        deck.forEach((card, index) => {
            const btn = document.createElement('button');
            btn.className = 'card';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Hidden card');
            btn.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-back">?</div>
                    <div class="card-face card-front">${card.emoji}</div>
                </div>
            `;
            btn.addEventListener('click', () => this.flip(btn, card));
            btn.dataset.index = String(index);
            btn.dataset.key = card.key;
            this.board.appendChild(btn);
        });
    }

    flip(btn, card) {
        if (this.lock || btn.classList.contains('flipped') || btn.classList.contains('matched')) return;
        btn.classList.add('flipped');
        this.flipped.push(btn);

        if (this.flipped.length < 2) return;

        this.moves += 1;
        this.updateStats();
        this.lock = true;

        const [a, b] = this.flipped;
        if (a.dataset.key === b.dataset.key) {
            a.classList.add('matched');
            b.classList.add('matched');
            a.disabled = true;
            b.disabled = true;
            this.flipped = [];
            this.lock = false;
            this.matches += 1;
            this.updateStats();
            if (this.matches === EMOJIS.length) this.win();
        } else {
            setTimeout(() => {
                a.classList.remove('flipped');
                b.classList.remove('flipped');
                this.flipped = [];
                this.lock = false;
            }, 700);
        }
    }

    win() {
        if (!this.best || this.moves < Number(this.best)) {
            this.best = String(this.moves);
            localStorage.setItem('memoryMatchBest', this.best);
            this.updateStats();
        }
        document.getElementById('gameMessages').innerHTML =
            `<div class="message success">You matched them all in ${this.moves} moves! 🎉</div>`;
    }

    updateStats() {
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('matches').textContent = `${this.matches}/${EMOJIS.length}`;
        document.getElementById('best').textContent = this.best || '—';
    }
}

document.addEventListener('DOMContentLoaded', () => new MemoryMatch());
