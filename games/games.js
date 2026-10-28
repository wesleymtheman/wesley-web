// Games hub
// WesleyDude.com

const PLAYABLE_GAMES = [
    'shop-master.html',
    'cooking-master.html',
    'snake-master.html',
    'ghost-hunt.html',
    'memory-match.html',
    'reaction-rush.html',
    'mole-mash.html'
];

document.addEventListener('DOMContentLoaded', () => {
    const randomBtn = document.getElementById('randomGameBtn');
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            const pick = PLAYABLE_GAMES[Math.floor(Math.random() * PLAYABLE_GAMES.length)];
            window.location.href = pick;
        });
    }
});
