// Games hub
// WesleyDude.com

const GAME_CATALOG = [
    { file: 'shop-master.html', id: 'shop-master', icon: '🏪', title: 'Shop Master', blurb: 'Manage inventory, serve customers, and grow your shop.', difficulty: 'Medium', category: 'Management' },
    { file: 'cooking-master.html', id: 'cooking-master', icon: '🍳', title: 'Cooking Master', blurb: 'Follow recipes and time your ingredients just right.', difficulty: 'Easy', category: 'Cooking' },
    { file: 'snake-master.html', id: 'snake-master', icon: '🐍', title: 'Snake Master', blurb: 'Classic snake - eat, grow, and do not hit yourself.', difficulty: 'Medium', category: 'Arcade' },
    { file: 'ghost-hunt.html', id: 'ghost-hunt', icon: '👻', title: 'Ghost Hunt', blurb: 'Collect candy and dodge ghosts in the dark.', difficulty: 'Medium', category: 'Spooky' },
    { file: 'memory-match.html', id: 'memory-match', icon: '🧠', title: 'Memory Match', blurb: 'Flip cards and find every pair.', difficulty: 'Easy', category: 'Puzzle' },
    { file: 'reaction-rush.html', id: 'reaction-rush', icon: '⚡', title: 'Reaction Rush', blurb: 'Wait for green, then click as fast as you can.', difficulty: 'Easy', category: 'Reflex' },
    { file: 'mole-mash.html', id: 'mole-mash', icon: '🐹', title: 'Mole Mash', blurb: 'Whack moles before they hide.', difficulty: 'Easy', category: 'Arcade' },
    { file: 'number-guess.html', id: 'number-guess', icon: '🔢', title: 'Number Guess', blurb: 'Guess the secret number from 1 to 100.', difficulty: 'Easy', category: 'Puzzle' },
    { file: 'dice-roll.html', id: 'dice-roll', icon: '🎲', title: 'Dice Roll', blurb: 'Roll two dice. Doubles score double!', difficulty: 'Easy', category: 'Luck' },
    { file: 'rock-paper-scissors.html', id: 'rock-paper-scissors', icon: '✊', title: 'Rock Paper Scissors', blurb: 'Beat the computer round after round.', difficulty: 'Easy', category: 'Classic' },
    { file: 'tic-tac-toe.html', id: 'tic-tac-toe', icon: '⭕', title: 'Tic Tac Toe', blurb: 'Get three in a row against the computer.', difficulty: 'Easy', category: 'Classic' },
    { file: 'click-rush.html', id: 'click-rush', icon: '👆', title: 'Click Rush', blurb: 'Mash the button for 10 seconds.', difficulty: 'Easy', category: 'Reflex' },
    { file: 'color-match.html', id: 'color-match', icon: '🎨', title: 'Color Match', blurb: 'Tap the square that matches the color name.', difficulty: 'Easy', category: 'Puzzle' },
    { file: 'coin-flip.html', id: 'coin-flip', icon: '🪙', title: 'Coin Flip', blurb: 'Call heads or tails before the flip.', difficulty: 'Easy', category: 'Luck' },
    { file: 'balloon-pop.html', id: 'balloon-pop', icon: '🎈', title: 'Balloon Pop', blurb: 'Pop balloons before time runs out.', difficulty: 'Easy', category: 'Arcade' },
    { file: 'paddle-bounce.html', id: 'paddle-bounce', icon: '🏓', title: 'Paddle Bounce', blurb: 'Keep the ball bouncing with your paddle.', difficulty: 'Medium', category: 'Arcade' },
    { file: 'lucky-spin.html', id: 'lucky-spin', icon: '🎡', title: 'Lucky Spin', blurb: 'Spin the wheel and rack up points.', difficulty: 'Easy', category: 'Luck' },
    { file: 'messiah-soccer.html', id: 'messiah-soccer', icon: '⚽', title: 'Messiah Soccer', blurb: 'Play as Messiah vs rivals — kick only, two goals!', difficulty: 'Medium', category: 'Sports' },
    { file: 'dragon-quest.html', id: 'dragon-quest', icon: '🐉', title: 'Dragon Quest', blurb: 'Fight dragons and collect treasure before time runs out.', difficulty: 'Easy', category: 'Adventure' },
    { file: 'pet-rescue.html', id: 'pet-rescue', icon: '🐾', title: 'Pet Rescue', blurb: 'Find lost pets around the neighborhood before dark.', difficulty: 'Easy', category: 'Adventure' },
    { file: 'dunk-contest.html', id: 'dunk-contest', icon: '🏀', title: 'Dunk Contest', blurb: 'Dunk vs rivals — hit the green zone before the shot clock!', difficulty: 'Medium', category: 'Sports' },
    { file: 'haunted-halls.html', id: 'haunted-halls', icon: '🕯️', title: 'Haunted Halls', blurb: 'First-person scare — grab keys and escape before the shadow finds you.', difficulty: 'Hard', category: 'Spooky' },
    { file: 'whats-the-time.html', id: 'whats-the-time', icon: '🕐', title: "What's the Time, Mr. Clock?", blurb: 'Ask the time, step closer — then RUN when Mr. Clock says Midnight!', difficulty: 'Easy', category: 'Classic' }
];

const PLAYABLE_GAMES = GAME_CATALOG.map(g => g.file);
const REQUESTS_KEY = 'wesleyGameRequests';

const STARTER_REQUESTS = [
    { name: 'Messiah', title: 'Basketball Showdown', details: 'Dunk contest with two teams and a shot clock.', createdAt: '2026-01-01T12:00:00.000Z' },
    { name: 'Camden', title: 'Pet Rescue', details: 'Find lost pets around the neighborhood before dark.', createdAt: '2026-01-02T12:00:00.000Z' }
];

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function loadRequests() {
    try {
        const raw = localStorage.getItem(REQUESTS_KEY);
        if (!raw) {
            localStorage.setItem(REQUESTS_KEY, JSON.stringify(STARTER_REQUESTS));
            return [...STARTER_REQUESTS];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [...STARTER_REQUESTS];
    } catch (e) {
        return [...STARTER_REQUESTS];
    }
}

function saveRequests(requests) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

function formatRequestDate(iso) {
    try {
        return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return '';
    }
}

function renderRequestsList() {
    const list = document.getElementById('gameRequestsList');
    if (!list) return;

    const requests = loadRequests().slice().reverse();
    if (!requests.length) {
        list.innerHTML = '<li class="game-requests-empty">No requests yet — be the first!</li>';
        return;
    }

    list.innerHTML = requests.map((req) => {
        const who = (req.name && String(req.name).trim()) || 'Anonymous';
        return `
            <li>
                <p class="request-title">${escapeHtml(req.title)}</p>
                <p class="request-details">${escapeHtml(req.details)}</p>
                <p class="request-meta">Requested by ${escapeHtml(who)} · ${formatRequestDate(req.createdAt)}</p>
            </li>
        `;
    }).join('');
}

function initGameRequests() {
    const form = document.getElementById('gameRequestForm');
    const feedback = document.getElementById('requestFeedback');
    if (!form) return;

    renderRequestsList();

    if (form.dataset.bound) return;
    form.dataset.bound = '1';

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = (document.getElementById('requestName').value || '').trim();
        const title = (document.getElementById('requestTitle').value || '').trim();
        const details = (document.getElementById('requestDetails').value || '').trim();

        if (!title || !details) {
            if (feedback) {
                feedback.textContent = 'Add a game idea and a short description.';
                feedback.classList.add('error');
            }
            return;
        }

        const requests = loadRequests();
        requests.push({
            name: name.slice(0, 40),
            title: title.slice(0, 60),
            details: details.slice(0, 280),
            createdAt: new Date().toISOString()
        });
        saveRequests(requests);
        renderRequestsList();
        form.reset();

        if (feedback) {
            feedback.classList.remove('error');
            feedback.textContent = 'Request sent! Wesley can see it on this page.';
            setTimeout(() => {
                if (feedback.textContent.startsWith('Request sent')) feedback.textContent = '';
            }, 3500);
        }
    });
}

function renderGamesHub() {
    const container = document.getElementById('gamesContainer');
    if (container) {
        container.innerHTML = GAME_CATALOG.map(g => `
            <article class="game-card" data-game="${g.id}">
                <div class="game-preview"><div class="game-icon">${g.icon}</div></div>
                <div class="game-info">
                    <h3>${g.title}</h3>
                    <p>${g.blurb}</p>
                    <div class="game-stats">
                        <span class="difficulty">${g.difficulty}</span>
                        <span class="category">${g.category}</span>
                    </div>
                    <a href="${g.file}" class="btn btn-primary play-btn">Play</a>
                </div>
            </article>
        `).join('');
    }

    const randomBtn = document.getElementById('randomGameBtn');
    if (randomBtn && !randomBtn.dataset.bound) {
        randomBtn.dataset.bound = '1';
        randomBtn.addEventListener('click', () => {
            const pick = PLAYABLE_GAMES[Math.floor(Math.random() * PLAYABLE_GAMES.length)];
            window.location.href = pick;
        });
    }

    initGameRequests();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGamesHub);
} else {
    renderGamesHub();
}
