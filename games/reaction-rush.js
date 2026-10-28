// Reaction Rush
// WesleyDude.com

class ReactionRush {
    constructor() {
        this.pad = document.getElementById('reactionPad');
        this.padText = document.getElementById('padText');
        this.state = 'idle';
        this.timer = null;
        this.startAt = 0;
        this.tries = 0;
        this.best = localStorage.getItem('reactionRushBest');
        this.updateStats();
        this.bind();
    }

    bind() {
        this.pad.addEventListener('click', () => this.onClick());
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    onClick() {
        if (this.state === 'idle' || this.state === 'result' || this.state === 'fail') {
            this.beginWait();
            return;
        }
        if (this.state === 'waiting') {
            clearTimeout(this.timer);
            this.state = 'fail';
            this.setPad('fail', 'Too soon! Click to try again');
            return;
        }
        if (this.state === 'go') {
            const ms = Math.round(performance.now() - this.startAt);
            this.tries += 1;
            if (!this.best || ms < Number(this.best)) {
                this.best = String(ms);
                localStorage.setItem('reactionRushBest', this.best);
            }
            this.state = 'result';
            this.setPad('result', `${ms} ms — click to go again`);
            document.getElementById('last').textContent = `${ms} ms`;
            this.updateStats();
        }
    }

    beginWait() {
        clearTimeout(this.timer);
        this.state = 'waiting';
        this.setPad('ready', 'Wait for green...');
        const delay = 1200 + Math.random() * 2800;
        this.timer = setTimeout(() => {
            this.state = 'go';
            this.startAt = performance.now();
            this.setPad('go', 'CLICK!');
        }, delay);
    }

    setPad(cls, text) {
        this.pad.className = `reaction-pad ${cls}`;
        this.padText.textContent = text;
    }

    updateStats() {
        document.getElementById('best').textContent = this.best ? `${this.best} ms` : '—';
        document.getElementById('tries').textContent = this.tries;
    }
}

document.addEventListener('DOMContentLoaded', () => new ReactionRush());
